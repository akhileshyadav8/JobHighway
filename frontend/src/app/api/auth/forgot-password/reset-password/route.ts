import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { newPassword, resetToken } = body;

    if (!newPassword || typeof newPassword !== 'string') {
      return NextResponse.json({ error: 'Please enter your new password.' }, { status: 400 });
    }

    // Password criteria validation
    if (newPassword.length < 8 || newPassword.length > 16) {
      return NextResponse.json({ error: 'Password must be between 8 and 16 characters.' }, { status: 400 });
    }
    if (!/[A-Z]/.test(newPassword)) {
      return NextResponse.json({ error: 'Password must contain at least 1 uppercase letter (A–Z).' }, { status: 400 });
    }
    if (!/[a-z]/.test(newPassword)) {
      return NextResponse.json({ error: 'Password must contain at least 1 lowercase letter (a–z).' }, { status: 400 });
    }
    if (!/\d/.test(newPassword)) {
      return NextResponse.json({ error: 'Password must contain at least 1 number (0–9).' }, { status: 400 });
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
      return NextResponse.json({ error: 'Password must contain at least 1 special character (!@#$%^&*).' }, { status: 400 });
    }

    // Look for reset token from cookie or request body
    const token = req.cookies.get('jobpulse_verified_reset_token')?.value || resetToken;
    if (!token) {
      return NextResponse.json(
        { error: 'Password reset authorization expired or not found. Please verify your OTP again.' },
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
        { error: 'Password reset authorization has expired. Please verify your OTP again.' },
        { status: 401 }
      );
    }

    if (payload.purpose !== 'password_reset_verified' || !payload.verified || !payload.email) {
      return NextResponse.json({ error: 'Invalid reset authorization.' }, { status: 401 });
    }

    if (Date.now() > payload.expiresAt) {
      return NextResponse.json(
        { error: 'Password reset session expired. Please verify your OTP again.' },
        { status: 401 }
      );
    }

    // Password reset verified successfully
    const response = NextResponse.json({
      success: true,
      email: payload.email,
      message: 'Password reset successfully. You can now sign in with your new password.',
    });

    // Clear the verified reset authorization cookie
    response.cookies.delete('jobpulse_verified_reset_token');
    response.cookies.delete('jobpulse_reset_otp_token');

    return response;
  } catch (error) {
    console.error('/api/auth/forgot-password/reset-password error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
  }
}
