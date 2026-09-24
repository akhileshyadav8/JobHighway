import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

// In-memory rate limiting (resets on cold start — acceptable for OTP)
const otpAttempts = new Map<string, { count: number; lastAttempt: number }>();
const OTP_WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 3;

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function isRateLimited(email: string): boolean {
  const now = Date.now();
  const record = otpAttempts.get(email);
  if (!record) return false;
  if (now - record.lastAttempt > OTP_WINDOW_MS) {
    otpAttempts.delete(email);
    return false;
  }
  return record.count >= MAX_REQUESTS_PER_WINDOW;
}

function incrementAttempts(email: string) {
  const now = Date.now();
  const record = otpAttempts.get(email);
  if (!record || now - record.lastAttempt > OTP_WINDOW_MS) {
    otpAttempts.set(email, { count: 1, lastAttempt: now });
  } else {
    otpAttempts.set(email, { count: record.count + 1, lastAttempt: now });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // Validate inputs
    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // Validate password strength
    if (password.length < 8 || password.length > 16) {
      return NextResponse.json({ error: 'Password must be 8–16 characters.' }, { status: 400 });
    }

    // Rate limiting
    if (isRateLimited(email)) {
      return NextResponse.json({ error: 'Too many requests. Please wait a minute before trying again.' }, { status: 429 });
    }
    incrementAttempts(email);

    // Generate OTP (valid for 1 minute)
    const otp = generateOtp();
    const expiresAt = Date.now() + 60 * 1000; // 1 minute

    // Sign a JWT containing the OTP + user data (sent back as a cookie)
    const secret = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || process.env.OTP_SECRET || 'jobhighway-otp-secret-change-in-production'
    );
    const token = await new SignJWT({ name: name.trim(), email: email.trim().toLowerCase(), password, otp, expiresAt })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1m')
      .sign(secret);

    let emailSentSuccessfully = false;
    let emailErrorMessage = '';

    // Send OTP email via Resend
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(RESEND_API_KEY);
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'JobHighway <onboarding@resend.dev>';
        const sendResult = await resend.emails.send({
          from: fromEmail,
          to: [email.trim()],
          subject: `${otp} — Your JobHighway Verification Code`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #ffffff;">
              <div style="margin-bottom: 24px;">
                <span style="font-size: 24px; font-weight: 900; color: #0d9488; letter-spacing: -0.5px;">JobHighway</span>
              </div>
              <h1 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 8px;">Verify your email address</h1>
              <p style="color: #64748b; font-size: 14px; margin: 0 0 24px; line-height: 1.6;">
                Hi ${name.trim()}, use this code to complete your JobHighway account setup.
              </p>
              <div style="background: #f1f5f9; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 24px;">
                <div style="font-size: 40px; font-weight: 900; letter-spacing: 8px; color: #0f172a; font-variant-numeric: tabular-nums;">${otp}</div>
                <p style="color: #64748b; font-size: 12px; margin: 8px 0 0;">Expires in 1 minute · Do not share this code</p>
              </div>
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                If you didn't request this, you can safely ignore this email. This code is only valid once.
              </p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
              <p style="color: #cbd5e1; font-size: 11px; margin: 0;">JobHighway · Official ATS Job Discovery Platform</p>
            </div>
          `,
        });
        if (sendResult.error) {
          console.warn('Resend send warning:', sendResult.error);
          emailErrorMessage = sendResult.error.message;
        } else {
          emailSentSuccessfully = true;
        }
      } catch (emailErr: any) {
        console.error('Failed to send OTP email:', emailErr);
        emailErrorMessage = emailErr?.message || 'Failed to send OTP email.';
      }
    } else {
      // Development fallback — log OTP to server console
      console.info(`[DEV] OTP for ${email}: ${otp}`);
    }

    // Set the OTP token as an HttpOnly cookie
    const response = NextResponse.json({ 
      success: true, 
      message: emailSentSuccessfully ? 'OTP sent to your email. Please check your inbox.' : 'OTP generated.',
      // If email failed or in development without key, expose OTP so user isn't stuck
      ...(!emailSentSuccessfully ? { 
        devOtp: otp,
        emailWarning: emailErrorMessage || 'Email not sent (Resend sandbox only delivers to your registered account email until domain is verified).'
      } : {})
    });
    response.cookies.set('jobhighway_otp_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60, // 1 minute
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('/api/auth/register error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
  }
}
