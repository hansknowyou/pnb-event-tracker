import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { verifyPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { corsHeaders } from '@/lib/cors';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Find user
    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401, headers: corsHeaders() }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is disabled. Please contact administrator.' },
        { status: 403, headers: corsHeaders() }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401, headers: corsHeaders() }
      );
    }

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      username: user.username,
      displayName: user.displayName,
      isAdmin: user.isAdmin,
      languagePreference: user.languagePreference,
    });

    // Set cookie
    await setAuthCookie(token);

    return NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          username: user.username,
          displayName: user.displayName,
          isAdmin: user.isAdmin,
          languagePreference: user.languagePreference,
        },
      },
      { headers: corsHeaders() }
    );
  } catch (error: unknown) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
