import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import KnowledgeBaseItem from '@/lib/models/KnowledgeBaseItem';
import { corsHeaders } from '@/lib/cors';
import { getCurrentUser } from '@/lib/auth';

// GET - Fetch all non-deleted knowledge base items
export async function GET() {
  try {
    await dbConnect();

    // Fetch all non-deleted items, sorted by most recently updated
    const items = await KnowledgeBaseItem.find({ isDeleted: false }).sort({
      updatedAt: -1,
    });

    return NextResponse.json(items, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error fetching knowledge base items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch knowledge base items' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// POST - Create a new knowledge base item (admin only)
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders() }
      );
    }

    // Check admin permission
    if (!user.isAdmin) {
      return NextResponse.json(
        { error: 'Admin permission required' },
        { status: 403, headers: corsHeaders() }
      );
    }

    await dbConnect();
    const body = await req.json();

    // Validate required fields
    if (!body.title || body.title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Create new knowledge base item
    const item = await KnowledgeBaseItem.create({
      title: body.title.trim(),
      description: body.description || '',
      imageUrl: body.imageUrl || '',
      imageKey: body.imageKey || '',
      createdBy: user.userId,
      isDeleted: false,
    });

    return NextResponse.json(item, { status: 201, headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error creating knowledge base item:', error);
    return NextResponse.json(
      { error: 'Failed to create knowledge base item' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// OPTIONS - Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
