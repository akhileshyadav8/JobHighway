import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';

// Replay prevention cache
const usedResetOtps = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { otp } = body;

    if (!otp || typeof otp !== 'string' || otp.trim().length !== 6) {
      return NextResponse.json({ error: 'Please enter a valid 6-digit verification code.' }, { status: 400 });
    }

    // Read the reset OTP cookie
    const token = req.cookies.get('jobpulse_reset_otp_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Reset session expired or not found. Please request a new verification code.' },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || process.env.OTP_SECRET || 'jobpulse-otp-secret-change-in-production'
    );

    let payload: any;
    try {
      const result = await jwtVerify(token, secret);
      payload = result.payload;
    } catch {
      return NextResponse.json(
        { error: 'Invalid or expired session. Please request a new verification code.' },
        { status: 401 }
      );
    }

    if (payload.purpose !== 'password_reset') {
      return NextResponse.json({ error: 'Invalid token purpose.' }, { status: 400 });
    }

    if (Date.now() > payload.expiresAt) {
      return NextResponse.json(
        { error: 'Verification code has expired. Please request a new code.' },
        { status: 401 }
      );
    }

    const cleanOtp = otp.trim();
    const replayKey = `${payload.email}:${cleanOtp}:${payload.expiresAt}`;
    if (usedResetOtps.has(replayKey)) {
      return NextResponse.json(
        { error: 'This verification code has already been used. Please request a new code.' },
        { status: 400 }
      );
    }

    if (cleanOtp !== payload.otp) {
      return NextResponse.json(
        { error: 'Incorrect verification code. Please check and try again.' },
        { status: 400 }
      );
    }

    // Mark as used
    usedResetOtps.add(replayKey);
    setTimeout(() => usedResetOtps.delete(replayKey), 15 * 60 * 1000);

    // Issue a verified reset authorization token (valid for 15 minutes)
    const verifiedToken = await new SignJWT({
      email: payload.email,
      verified: true,
      purpose: 'password_reset_verified',
      expiresAt: Date.now() + 15 * 60 * 1000,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('15m')
      .sign(secret);

    const response = NextResponse.json({
      success: true,
      email: payload.email,
      resetToken: verifiedToken,
      message: 'Email verified successfully. You may now set your new password.',
    });

    // Delete the OTP token cookie, set the verified reset authorization cookie
    response.cookies.delete('jobpulse_reset_otp_token');
    response.cookies.set('jobpulse_verified_reset_token', verifiedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 900, // 15 minutes
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('/api/auth/forgot-password/verify-otp error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
  }
}
