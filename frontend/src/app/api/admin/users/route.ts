import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function GET() {
  try {
    const pool = getPool();
    if (!pool) {
      return NextResponse.json({ users: [] });
    }

    const result = await pool.query(
      `SELECT id, name, email, role, target_role as "targetRole", target_ctc as "targetCtc",
              preferred_location as "preferredLocation", skills, created_at as "createdAt", metadata
       FROM app_users
       ORDER BY created_at DESC`
    );

    return NextResponse.json({ users: result.rows || [] });
  } catch (error) {
    console.error('Admin users API GET error:', error);
    return NextResponse.json({ users: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, email, role, targetRole, targetCtc, preferredLocation, skills, checkUnique } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const pool = getPool();

    if (pool) {
      // If checkUnique is requested (e.g. during user registration), enforce strict uniqueness
      if (checkUnique) {
        const existing = await pool.query(
          'SELECT id FROM app_users WHERE LOWER(email) = LOWER($1)',
          [cleanEmail]
        );
        if (existing.rows && existing.rows.length > 0) {
          return NextResponse.json(
            { error: 'An account with this email already exists. Please sign in or reset your password.' },
            { status: 409 }
          );
        }
      }

      const userId = id || 'usr_' + Date.now();
      await pool.query(
        `INSERT INTO app_users (id, name, email, role, target_role, target_ctc, preferred_location, skills, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
         ON CONFLICT (email) 
         DO UPDATE SET 
           name = EXCLUDED.name,
           target_role = COALESCE(EXCLUDED.target_role, app_users.target_role),
           target_ctc = COALESCE(EXCLUDED.target_ctc, app_users.target_ctc),
           preferred_location = COALESCE(EXCLUDED.preferred_location, app_users.preferred_location)`,
        [
          userId,
          name || cleanEmail.split('@')[0],
          cleanEmail,
          role || 'user',
          targetRole || null,
          targetCtc || null,
          preferredLocation || null,
          skills || []
        ]
      );
      return NextResponse.json({ success: true, userId });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin users API POST error:', error);
    return NextResponse.json({ error: 'Failed to process user' }, { status: 500 });
  }
}
