import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GlobalKnowledgeLinks from '@/lib/models/GlobalKnowledgeLinks';

// GET - Get all global knowledge links
export async function GET() {
  try {
    await connectDB();
    const instance = await GlobalKnowledgeLinks.getInstance();

    // Convert Map to plain object
    const links: Record<string, string[]> = {};
    if (instance.links) {
      instance.links.forEach((value: string[], key: string) => {
        links[key] = value;
      });
    }

    return NextResponse.json({ links });
  } catch (error) {
    console.error('Error fetching global knowledge links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch global knowledge links' },
      { status: 500 }
    );
  }
}

// PUT - Update global knowledge links for a section
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { section, knowledgeIds } = await request.json();

    if (!section) {
      return NextResponse.json(
        { error: 'Section is required' },
        { status: 400 }
      );
    }

    const instance = await GlobalKnowledgeLinks.getInstance();

    // Update the links for this section
    instance.links.set(section, knowledgeIds || []);
    await instance.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating global knowledge links:', error);
    return NextResponse.json(
      { error: 'Failed to update global knowledge links' },
      { status: 500 }
    );
  }
}
