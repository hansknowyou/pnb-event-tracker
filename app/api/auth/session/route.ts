import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { corsHeaders } from '@/lib/cors';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { user: null },
        { headers: corsHeaders() }
      );
    }

    return NextResponse.json(
      { user },
      { headers: corsHeaders() }
    );
  } catch (error: unknown) {
    console.error('Session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
