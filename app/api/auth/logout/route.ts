import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';
import { corsHeaders } from '@/lib/cors';

export async function POST() {
  try {
    await clearAuthCookie();

    return NextResponse.json(
      { message: 'Logged out successfully' },
      { headers: corsHeaders() }
    );
  } catch (error: unknown) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
