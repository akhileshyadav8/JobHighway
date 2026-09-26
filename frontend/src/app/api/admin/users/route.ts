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
    const { id, name, email, role, targetRole, targetCtc, preferredLocation, skills } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const userId = id || 'usr_' + Date.now();
    const pool = getPool();

    if (pool) {
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
          name || email.split('@')[0],
          email.toLowerCase().trim(),
          role || 'user',
          targetRole || null,
          targetCtc || null,
          preferredLocation || null,
          skills || []
        ]
      );
    }

    return NextResponse.json({ success: true, userId });
  } catch (error) {
    console.error('Admin users API POST error:', error);
    return NextResponse.json({ error: 'Failed to save user' }, { status: 500 });
  }
}
