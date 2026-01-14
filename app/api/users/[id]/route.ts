import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { getCurrentUser, hashPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { corsHeaders } from '@/lib/cors';

// PATCH - Update user (admin or self)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders() }
      );
    }

    // Get the user being updated to check if it's the protected admin
    const targetUser = await User.findById(id);
    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    const body = await req.json();

    // Protect the original admin user from being deactivated or deleted
    if (targetUser.username === 'admin' && currentUser.userId !== id) {
      // Only the admin themselves can update their own account
      if (body.isActive === false) {
        return NextResponse.json(
          { error: 'Cannot deactivate the system administrator account' },
          { status: 403, headers: corsHeaders() }
        );
      }
    }

    // Check permissions
    const isSelf = currentUser.userId === id;
    const isAdmin = currentUser.isAdmin;

    if (!isSelf && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders() }
      );
    }

    // Build update object
    const updateData: any = {};

    // Regular users can only update their own display name and language preference
    if (isSelf && !isAdmin) {
      if (body.displayName !== undefined) updateData.displayName = body.displayName;
      if (body.languagePreference !== undefined) updateData.languagePreference = body.languagePreference;
      if (body.password) {
        updateData.password = await hashPassword(body.password);
      }
    }

    // Admin can update everything except making themselves non-admin
    if (isAdmin) {
      if (body.displayName !== undefined) updateData.displayName = body.displayName;
      if (body.languagePreference !== undefined) updateData.languagePreference = body.languagePreference;
      if (body.password) {
        updateData.password = await hashPassword(body.password);
      }
      if (typeof body.isActive === 'boolean') {
        // Don't allow admin to deactivate themselves
        if (id !== currentUser.userId) {
          updateData.isActive = body.isActive;
        }
      }
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    // If user updated their own profile, regenerate JWT token with updated data
    if (isSelf) {
      const token = generateToken({
        userId: user._id.toString(),
        username: user.username,
        displayName: user.displayName,
        isAdmin: user.isAdmin,
        languagePreference: user.languagePreference,
      });
      await setAuthCookie(token);
    }

    return NextResponse.json(user, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// DELETE - Delete user (admin only, cannot delete self)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders() }
      );
    }

    // Don't allow admin to delete themselves
    if (id === currentUser.userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Protect the original admin user from being deleted by anyone
    const targetUser = await User.findById(id);
    if (targetUser && targetUser.username === 'admin') {
      return NextResponse.json(
        { error: 'Cannot delete the system administrator account' },
        { status: 403, headers: corsHeaders() }
      );
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { headers: corsHeaders() }
    );
  } catch (error: unknown) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
