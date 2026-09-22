import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

// In-memory rate limiting (60-second window, max 3 attempts)
const resetOtpAttempts = new Map<string, { count: number; lastAttempt: number }>();
const OTP_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 3;

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function isRateLimited(email: string): boolean {
  const now = Date.now();
  const record = resetOtpAttempts.get(email);
  if (!record) return false;
  if (now - record.lastAttempt > OTP_WINDOW_MS) {
    resetOtpAttempts.delete(email);
    return false;
  }
  return record.count >= MAX_REQUESTS_PER_WINDOW;
}

function incrementAttempts(email: string) {
  const now = Date.now();
  const record = resetOtpAttempts.get(email);
  if (!record || now - record.lastAttempt > OTP_WINDOW_MS) {
    resetOtpAttempts.set(email, { count: 1, lastAttempt: now });
  } else {
    resetOtpAttempts.set(email, { count: record.count + 1, lastAttempt: now });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json({ error: 'Please enter your registered email address.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // Rate limiting
    if (isRateLimited(cleanEmail)) {
      return NextResponse.json(
        { error: 'Too many reset requests. Please wait a minute before requesting another code.' },
        { status: 429 }
      );
    }
    incrementAttempts(cleanEmail);

    // Generate 6-digit numeric OTP
    const otp = generateOtp();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Sign JWT token stored in HttpOnly cookie
    const secret = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || process.env.OTP_SECRET || 'jobpulse-otp-secret-change-in-production'
    );

    const token = await new SignJWT({
      email: cleanEmail,
      otp,
      expiresAt,
      purpose: 'password_reset'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('10m')
      .sign(secret);

    // Send OTP email via Resend if configured
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(RESEND_API_KEY);
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'JobPulse Security <onboarding@resend.dev>';
        await resend.emails.send({
          from: fromEmail,
          to: [cleanEmail],
          subject: `${otp} — JobPulse Password Reset Code`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 36px 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
              <div style="margin-bottom: 24px;">
                <span style="font-size: 24px; font-weight: 900; color: #0d9488; letter-spacing: -0.5px;">JobPulse</span>
              </div>
              <h1 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 8px; letter-spacing: -0.3px;">
                Password Reset Verification
              </h1>
              <p style="color: #475569; font-size: 14px; margin: 0 0 24px; line-height: 1.6;">
                We received a request to reset the password for your JobPulse account. Enter the 6-digit verification code below to proceed:
              </p>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 24px;">
                <div style="font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #0f172a; font-variant-numeric: tabular-nums;">${otp}</div>
                <p style="color: #64748b; font-size: 12px; margin: 10px 0 0; font-weight: 500;">
                  Expires in 10 minutes · Single-use code
                </p>
              </div>
              <p style="color: #64748b; font-size: 12px; margin: 0 0 8px; line-height: 1.5;">
                If you did not request this password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
              <p style="color: #94a3b8; font-size: 11px; margin: 0;">
                JobPulse · Official ATS Job Discovery Platform
              </p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('Failed to dispatch password reset OTP email:', emailErr);
      }
    } else {
      console.info(`[DEV] Password Reset OTP for ${cleanEmail}: ${otp}`);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Verification code sent to your email. Please check your inbox.',
      ...(RESEND_API_KEY ? {} : { devOtp: otp })
    });

    response.cookies.set('jobpulse_reset_otp_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('/api/auth/forgot-password error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
  }
}
