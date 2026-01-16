import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import KnowledgeBaseItem from '@/lib/models/KnowledgeBaseItem';
import { corsHeaders } from '@/lib/cors';

// POST - Fetch multiple knowledge base items by IDs
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    // Validate request
    if (!body.ids || !Array.isArray(body.ids)) {
      return NextResponse.json(
        { error: 'ids array is required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Fetch items by IDs (only non-deleted items)
    const items = await KnowledgeBaseItem.find({
      _id: { $in: body.ids },
      isDeleted: false,
    });

    // Convert to objects and ensure tags field exists
    const itemsWithTags = items.map(item => {
      const obj = item.toObject();
      obj.tags = item.tags || [];
      return obj;
    });

    return NextResponse.json(itemsWithTags, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error fetching knowledge base items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch knowledge base items' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// OPTIONS - Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
