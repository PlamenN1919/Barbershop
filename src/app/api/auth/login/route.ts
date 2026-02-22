import { NextRequest, NextResponse } from 'next/server';
import { createSession, deleteSession } from '@/lib/db';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@barbershop.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Моля, въведете имейл и парола.' },
        { status: 400 }
      );
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Грешен имейл или парола.' },
        { status: 401 }
      );
    }

    const token = await createSession();

    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Невалидна заявка.' },
      { status: 400 }
    );
  }
}
