import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Track used OTPs to prevent replay attacks
const usedOtps = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { otp } = body;

    if (!otp || typeof otp !== 'string' || otp.length !== 6) {
      return NextResponse.json({ error: 'Please enter a valid 6-digit OTP.' }, { status: 400 });
    }

    // Read the OTP token cookie
    const token = req.cookies.get('jobhighway_otp_token')?.value || req.cookies.get('jobpulse_otp_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Verification session expired. Please register again.' }, { status: 401 });
    }

    // Verify the JWT
    const secret = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || process.env.OTP_SECRET || 'jobhighway-otp-secret-change-in-production'
    );

    let payload: any;
    try {
      const result = await jwtVerify(token, secret);
      payload = result.payload;
    } catch {
      return NextResponse.json({ error: 'Verification session expired. Please register again.' }, { status: 401 });
    }

    // Check OTP expiry
    if (Date.now() > payload.expiresAt) {
      return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 401 });
    }

    // Check for replay attack (OTP already used)
    const otpKey = `${payload.email}:${otp}:${payload.expiresAt}`;
    if (usedOtps.has(otpKey)) {
      return NextResponse.json({ error: 'This OTP has already been used. Please request a new one.' }, { status: 400 });
    }

    // Verify OTP
    if (otp !== payload.otp) {
      return NextResponse.json({ error: 'Incorrect OTP. Please check and try again.' }, { status: 400 });
    }

    // Mark OTP as used (single-use)
    usedOtps.add(otpKey);
    // Cleanup old entries after 15 min
    setTimeout(() => usedOtps.delete(otpKey), 15 * 60 * 1000);

    // Success — clear the cookie, return user data for localStorage registration
    const response = NextResponse.json({
      success: true,
      user: {
        name: payload.name,
        email: payload.email,
        password: payload.password,
      },
    });
    response.cookies.delete('jobhighway_otp_token');

    return response;
  } catch (error) {
    console.error('/api/auth/verify-otp error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
  }
}
