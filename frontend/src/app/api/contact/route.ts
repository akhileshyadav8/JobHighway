import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, topic, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    if (message.trim().length > 300) {
      return NextResponse.json({ error: 'Message cannot exceed 300 characters.' }, { status: 400 });
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

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;
    const pool = getPool();
    if (pool && id && status) {
      await pool.query(
        `UPDATE contact_inquiries SET status = $1 WHERE id = $2`,
        [status, id]
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update inquiry API error:', error);
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const email = searchParams.get('email');
    const pool = getPool();

    if (pool) {
      if (id) {
        await pool.query(`DELETE FROM contact_inquiries WHERE id = $1`, [id]);
      } else if (email) {
        await pool.query(`DELETE FROM contact_inquiries WHERE LOWER(email) = LOWER($1)`, [email.trim()]);
      }
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete inquiry API error:', error);
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
  }
}
