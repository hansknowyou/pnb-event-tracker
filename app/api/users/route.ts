import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { getCurrentUser, hashPassword } from '@/lib/auth';
import { corsHeaders } from '@/lib/cors';

// GET - List all users (admin only)
export async function GET() {
  try {
    await dbConnect();

    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders() }
      );
    }

    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    return NextResponse.json(users, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// POST - Create new user (admin only)
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders() }
      );
    }

    const { username, password, displayName } = await req.json();

    if (!username || !password || !displayName) {
      return NextResponse.json(
        { error: 'Username, password, and display name are required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      username: username.toLowerCase(),
      password: hashedPassword,
      displayName,
      isAdmin: false,
      isActive: true,
      languagePreference: 'en',
    });

    // Return user without password
    const userResponse = {
      _id: user._id,
      username: user.username,
      displayName: user.displayName,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      languagePreference: user.languagePreference,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json(userResponse, { status: 201, headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
