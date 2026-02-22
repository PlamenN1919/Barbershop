import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/db';

/**
 * Помощна функция за проверка на админ сесия.
 * Връща true ако потребителят е автентикиран.
 */
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('admin_session')?.value;
  if (!token) return false;
  return await validateSession(token);
}

/**
 * Връща 401 Unauthorized response.
 */
export function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'Неоторизиран достъп. Моля, влезте в системата.' },
    { status: 401 }
  );
}
