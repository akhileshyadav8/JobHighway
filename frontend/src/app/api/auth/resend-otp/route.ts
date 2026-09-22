import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';

// Resend cooldown tracking
const resendCooldowns = new Map<string, number>();
const MAX_RESEND_ATTEMPTS = 3;
const resendAttemptCount = new Map<string, number>();

export async function POST(req: NextRequest) {
  try {
    // Read the existing OTP token cookie
    const token = req.cookies.get('jobpulse_otp_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No active verification session. Please register again.' }, { status: 401 });
    }

    // Verify the JWT to get user data (allow expired OTP, just not expired JWT)
    const secret = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || process.env.OTP_SECRET || 'jobpulse-otp-secret-change-in-production'
    );

    let payload: any;
    try {
      const result = await jwtVerify(token, secret);
      payload = result.payload;
    } catch {
      return NextResponse.json({ error: 'Session expired. Please register again.' }, { status: 401 });
    }

    const email = payload.email;

    // Check resend cooldown (60 seconds)
    const lastResend = resendCooldowns.get(email);
    if (lastResend && Date.now() - lastResend < 60 * 1000) {
      const remaining = Math.ceil((60 * 1000 - (Date.now() - lastResend)) / 1000);
      return NextResponse.json({ error: `Please wait ${remaining}s before requesting a new OTP.` }, { status: 429 });
    }

    // Check max resend attempts
    const attempts = resendAttemptCount.get(email) || 0;
    if (attempts >= MAX_RESEND_ATTEMPTS) {
      return NextResponse.json({ error: 'Maximum resend attempts reached. Please register again.' }, { status: 429 });
    }

    // Generate new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    // Update cooldown and attempts
    resendCooldowns.set(email, Date.now());
    resendAttemptCount.set(email, attempts + 1);

    // Sign new token
    const newToken = await new SignJWT({ ...payload, otp: newOtp, expiresAt })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('10m')
      .sign(secret);

    // Send new OTP email
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(RESEND_API_KEY);
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'JobPulse <onboarding@resend.dev>';
        await resend.emails.send({
          from: fromEmail,
          to: [email],
          subject: `${newOtp} — Your new JobPulse Verification Code`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #ffffff;">
              <div style="margin-bottom: 24px;">
                <span style="font-size: 24px; font-weight: 900; color: #0d9488; letter-spacing: -0.5px;">JobPulse</span>
              </div>
              <h1 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 8px;">New verification code</h1>
              <p style="color: #64748b; font-size: 14px; margin: 0 0 24px;">Your new OTP is:</p>
              <div style="background: #f1f5f9; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 24px;">
                <div style="font-size: 40px; font-weight: 900; letter-spacing: 8px; color: #0f172a;">${newOtp}</div>
                <p style="color: #64748b; font-size: 12px; margin: 8px 0 0;">Expires in 10 minutes · Single use only</p>
              </div>
              <p style="color: #94a3b8; font-size: 12px;">If you didn't request this, ignore this email.</p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('Resend OTP email failed:', emailErr);
      }
    } else {
      console.info(`[DEV] New OTP for ${email}: ${newOtp}`);
    }

    // Set updated cookie
    const response = NextResponse.json({
      success: true,
      message: 'New OTP sent to your email.',
      attemptsRemaining: MAX_RESEND_ATTEMPTS - (attempts + 1),
      ...(RESEND_API_KEY ? {} : { devOtp: newOtp }),
    });
    response.cookies.set('jobpulse_otp_token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('/api/auth/resend-otp error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
  }
}
