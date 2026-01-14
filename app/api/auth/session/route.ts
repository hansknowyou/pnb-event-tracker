import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { corsHeaders } from '@/lib/cors';

export async function GET() {
  try {
    const tokenPayload = await getCurrentUser();

    if (!tokenPayload) {
      return NextResponse.json(
        { user: null },
        { headers: corsHeaders() }
      );
    }

    // Map userId to id for frontend compatibility
    const user = {
      id: tokenPayload.userId,
      username: tokenPayload.username,
      displayName: tokenPayload.displayName,
      isAdmin: tokenPayload.isAdmin,
      languagePreference: tokenPayload.languagePreference,
    };

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
