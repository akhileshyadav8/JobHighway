import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, topic, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    const id = 'inq_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const pool = getPool();

    if (pool) {
      try {
        await pool.query(
          `INSERT INTO contact_inquiries (id, name, email, topic, subject, message, status, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, 'New', NOW())`,
          [id, name.trim(), email.trim(), topic || 'General Inquiry', subject?.trim() || 'General Inquiry', message.trim()]
        );
      } catch (dbErr) {
        console.error('Failed to save inquiry to PostgreSQL DB:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      inquiry: {
        id,
        name: name.trim(),
        email: email.trim(),
        topic: topic || 'General Inquiry',
        subject: subject?.trim() || 'General Inquiry',
        message: message.trim(),
        createdAt: new Date().toISOString(),
        status: 'New'
      }
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Failed to process inquiry' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const pool = getPool();
    if (!pool) {
      return NextResponse.json({ inquiries: [] });
    }

    const result = await pool.query(
      `SELECT id, name, email, topic, subject, message, status, created_at as "createdAt"
       FROM contact_inquiries
       ORDER BY created_at DESC
       LIMIT 100`
    );

    return NextResponse.json({ inquiries: result.rows || [] });
  } catch (error) {
    console.error('Get inquiries API error:', error);
    return NextResponse.json({ inquiries: [] });
  }
}
