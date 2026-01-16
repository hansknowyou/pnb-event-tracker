import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import KnowledgeBaseItem from '@/lib/models/KnowledgeBaseItem';
import { corsHeaders } from '@/lib/cors';
import { getCurrentUser } from '@/lib/auth';

// GET - Fetch single knowledge base item
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const item = await KnowledgeBaseItem.findById(id);

    if (!item || item.isDeleted) {
      return NextResponse.json(
        { error: 'Knowledge base item not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    console.log('GET - item.tags from DB:', item.tags);

    // Convert to object and explicitly include tags field
    const itemObject = item.toObject();
    itemObject.tags = item.tags || [];
    console.log('GET - Final response tags:', itemObject.tags);

    return NextResponse.json(itemObject, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error fetching knowledge base item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch knowledge base item' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// PATCH - Update knowledge base item (admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;
    const body = await req.json();

    // Find the item
    const item = await KnowledgeBaseItem.findById(id);
    if (!item || item.isDeleted) {
      return NextResponse.json(
        { error: 'Knowledge base item not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    // Update fields
    if (body.title !== undefined) {
      if (body.title.trim() === '') {
        return NextResponse.json(
          { error: 'Title cannot be empty' },
          { status: 400, headers: corsHeaders() }
        );
      }
      item.title = body.title.trim();
    }
    if (body.description !== undefined) {
      item.description = body.description;
    }
    if (body.imageUrl !== undefined) {
      item.imageUrl = body.imageUrl;
    }
    if (body.imageKey !== undefined) {
      item.imageKey = body.imageKey;
    }
    if (body.tags !== undefined) {
      if (Array.isArray(body.tags)) {
        console.log('Setting tags to:', body.tags);
        item.tags = body.tags;
        item.markModified('tags'); // CRITICAL: Mark array as modified for Mongoose
      }
    }

    await item.save();
    console.log('After save, item.tags:', item.tags);

    // Convert to object and explicitly include tags field
    const itemObject = item.toObject();
    // Explicitly add tags since it may not be included for old documents
    itemObject.tags = item.tags || [];
    console.log('Final response tags:', itemObject.tags);

    return NextResponse.json(itemObject, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error updating knowledge base item:', error);
    return NextResponse.json(
      { error: 'Failed to update knowledge base item' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// DELETE - Soft delete knowledge base item (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;

    // Find the item
    const item = await KnowledgeBaseItem.findById(id);
    if (!item) {
      return NextResponse.json(
        { error: 'Knowledge base item not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    // Soft delete
    item.isDeleted = true;
    await item.save();

    return NextResponse.json(
      { message: 'Knowledge base item deleted successfully' },
      { headers: corsHeaders() }
    );
  } catch (error: unknown) {
    console.error('Error deleting knowledge base item:', error);
    return NextResponse.json(
      { error: 'Failed to delete knowledge base item' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// OPTIONS - Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
