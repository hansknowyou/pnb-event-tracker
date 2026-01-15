import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Production from '@/lib/models/Production';
import KnowledgeBaseItem from '@/lib/models/KnowledgeBaseItem';
import { corsHeaders } from '@/lib/cors';
import { getCurrentUser } from '@/lib/auth';
import type { KnowledgeSection } from '@/types/knowledge';

const VALID_SECTIONS: KnowledgeSection[] = [
  'step1',
  'step2',
  'step3',
  'step4',
  'step5_videos',
  'step5_photos',
  'step5_actorPhotos',
  'step5_otherPhotos',
  'step5_logos',
  'step5_texts',
  'step6',
  'step7',
  'step8',
  'step9',
  'step10',
  'step11',
  'step12',
  'step13',
];

// POST - Add knowledge link to production step/subsection
export async function POST(
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

    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    // Validate request
    if (!body.section || !VALID_SECTIONS.includes(body.section)) {
      return NextResponse.json(
        { error: 'Invalid section' },
        { status: 400, headers: corsHeaders() }
      );
    }

    if (!body.knowledgeItemId) {
      return NextResponse.json(
        { error: 'knowledgeItemId is required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Check if knowledge item exists and is not deleted
    const knowledgeItem = await KnowledgeBaseItem.findById(body.knowledgeItemId);
    if (!knowledgeItem || knowledgeItem.isDeleted) {
      return NextResponse.json(
        { error: 'Knowledge item not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    // Find production
    const production = await Production.findById(id);
    if (!production) {
      return NextResponse.json(
        { error: 'Production not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    // Add knowledge link (construct field name)
    const fieldName = `knowledgeLinks_${body.section}` as keyof typeof production;
    const currentLinks = (production[fieldName] as string[]) || [];

    // Check for duplicates
    if (currentLinks.includes(body.knowledgeItemId)) {
      return NextResponse.json(
        { error: 'Knowledge item already linked' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Add to array
    currentLinks.push(body.knowledgeItemId);
    production[fieldName] = currentLinks as any;

    await production.save();

    return NextResponse.json(
      { message: 'Knowledge link added successfully', production },
      { headers: corsHeaders() }
    );
  } catch (error: unknown) {
    console.error('Error adding knowledge link:', error);
    return NextResponse.json(
      { error: 'Failed to add knowledge link' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// DELETE - Remove knowledge link from production step/subsection
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

    await dbConnect();
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const section = searchParams.get('section');
    const knowledgeItemId = searchParams.get('knowledgeItemId');

    // Validate request
    if (!section || !VALID_SECTIONS.includes(section as KnowledgeSection)) {
      return NextResponse.json(
        { error: 'Invalid section' },
        { status: 400, headers: corsHeaders() }
      );
    }

    if (!knowledgeItemId) {
      return NextResponse.json(
        { error: 'knowledgeItemId is required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Find production
    const production = await Production.findById(id);
    if (!production) {
      return NextResponse.json(
        { error: 'Production not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    // Remove knowledge link (construct field name)
    const fieldName = `knowledgeLinks_${section}` as keyof typeof production;
    const currentLinks = (production[fieldName] as string[]) || [];

    // Filter out the knowledge item
    const updatedLinks = currentLinks.filter((linkId) => linkId !== knowledgeItemId);

    production[fieldName] = updatedLinks as any;

    await production.save();

    return NextResponse.json(
      { message: 'Knowledge link removed successfully', production },
      { headers: corsHeaders() }
    );
  } catch (error: unknown) {
    console.error('Error removing knowledge link:', error);
    return NextResponse.json(
      { error: 'Failed to remove knowledge link' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// OPTIONS - Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
