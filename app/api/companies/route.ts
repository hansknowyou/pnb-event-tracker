import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Company from '@/lib/models/Company';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET all companies
export async function GET() {
  try {
    await connectDB();
    const companies = await Company.find({ isDeleted: false }).sort({ name: 1 });
    return NextResponse.json(companies, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST create new company
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const company = await Company.create({
      ...body,
      createdBy: body.createdBy || 'system',
    });

    return NextResponse.json(company, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500, headers: corsHeaders }
    );
  }
}
