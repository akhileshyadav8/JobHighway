import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';

const resendCooldowns = new Map<string, number>();
const MAX_RESEND_ATTEMPTS = 3;
const resendAttemptCount = new Map<string, number>();

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('jobpulse_reset_otp_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'No active password reset session. Please request a new reset code.' },
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
        { error: 'Session expired. Please request a new reset code.' },
        { status: 401 }
      );
    }

    const email = payload.email;

    // Check resend cooldown (60 seconds)
    const lastResend = resendCooldowns.get(email);
    if (lastResend && Date.now() - lastResend < 60 * 1000) {
      const remaining = Math.ceil((60 * 1000 - (Date.now() - lastResend)) / 1000);
      return NextResponse.json(
        { error: `Please wait ${remaining}s before requesting a new code.` },
        { status: 429 }
      );
    }

    // Check max resend attempts
    const attempts = resendAttemptCount.get(email) || 0;
    if (attempts >= MAX_RESEND_ATTEMPTS) {
      return NextResponse.json(
        { error: 'Maximum resend attempts reached. Please start over from the beginning.' },
        { status: 429 }
      );
    }

    // Generate new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    resendCooldowns.set(email, Date.now());
    resendAttemptCount.set(email, attempts + 1);

    const newToken = await new SignJWT({
      ...payload,
      otp: newOtp,
      expiresAt,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('10m')
      .sign(secret);

    // Send email via Resend
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(RESEND_API_KEY);
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'JobPulse Security <onboarding@resend.dev>';
        await resend.emails.send({
          from: fromEmail,
          to: [email],
          subject: `${newOtp} — Your New JobPulse Password Reset Code`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 36px 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
              <div style="margin-bottom: 24px;">
                <span style="font-size: 24px; font-weight: 900; color: #0d9488; letter-spacing: -0.5px;">JobPulse</span>
              </div>
              <h1 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 8px; letter-spacing: -0.3px;">
                New Password Reset Code
              </h1>
              <p style="color: #475569; font-size: 14px; margin: 0 0 24px; line-height: 1.6;">
                Your new 6-digit password reset verification code is:
              </p>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 24px;">
                <div style="font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #0f172a; font-variant-numeric: tabular-nums;">${newOtp}</div>
                <p style="color: #64748b; font-size: 12px; margin: 10px 0 0; font-weight: 500;">
                  Expires in 10 minutes · Single use only
                </p>
              </div>
              <p style="color: #64748b; font-size: 12px; margin: 0;">
                If you did not request this, you can ignore this email.
              </p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('Failed to send resend password reset email:', emailErr);
      }
    } else {
      console.info(`[DEV] New Password Reset OTP for ${email}: ${newOtp}`);
    }

    const response = NextResponse.json({
      success: true,
      message: 'A new verification code has been dispatched to your email.',
      attemptsRemaining: MAX_RESEND_ATTEMPTS - (attempts + 1),
      ...(RESEND_API_KEY ? {} : { devOtp: newOtp }),
    });

    response.cookies.set('jobpulse_reset_otp_token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('/api/auth/forgot-password/resend-otp error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
  }
}
