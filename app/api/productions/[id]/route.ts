import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Production from '@/lib/models/Production';
import { corsHeaders } from '@/lib/cors';

// GET - Fetch a single production
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const production = await Production.findById(id);

    if (!production) {
      return NextResponse.json(
        { error: 'Production not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    return NextResponse.json(production, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error fetching production:', error);
    return NextResponse.json(
      { error: 'Failed to fetch production' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// PATCH - Update a production (used for auto-save)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const production = await Production.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!production) {
      return NextResponse.json(
        { error: 'Production not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    return NextResponse.json(production, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error updating production:', error);
    return NextResponse.json(
      { error: 'Failed to update production' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// DELETE - Delete a production
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const production = await Production.findByIdAndDelete(id);

    if (!production) {
      return NextResponse.json(
        { error: 'Production not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    return NextResponse.json(
      { message: 'Production deleted successfully' },
      { headers: corsHeaders() }
    );
  } catch (error: unknown) {
    console.error('Error deleting production:', error);
    return NextResponse.json(
      { error: 'Failed to delete production' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// OPTIONS - Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
