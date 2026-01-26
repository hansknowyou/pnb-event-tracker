import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Production from '@/lib/models/Production';
import { corsHeaders } from '@/lib/cors';

// GET - Fetch all productions
export async function GET() {
  try {
    await dbConnect();
    const productions = await Production.find({}).sort({ updatedAt: -1 });
    return NextResponse.json(productions, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error fetching productions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch productions' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// POST - Create a new production
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    // Create new production with default values for all steps
    const production = await Production.create({
      title: body.title || 'Untitled Production',
      completionPercentage: 0,
      step1_contract: { link: '', notes: '' },
      step2_cities: [],
      step3_venueContracts: [],
      step4_itinerary: { link: '', notes: '' },
      step5_materials: {
        videos: { link: '', notes: '' },
        performerVideos: { link: '', notes: '' },
        musicCollection: { link: '', notes: '' },
        photos: { link: '', notes: '' },
        actorPhotos: { link: '', notes: '' },
        otherPhotos: { link: '', notes: '' },
        logos: { link: '', notes: '' },
        texts: { link: '', longDescription: '', shortDescription: '' },
      },
      step6_venueInfo: [],
      step7_designs: {
        media: [],
      },
      step8_promotionalImages: {
        media: [],
      },
      step9_videos: {
        media: [],
      },
      step16_venueMediaDesign: {
        media: [],
      },
      step10_pressConference: {
        location: '',
        invitationLetter: { link: '', notes: '' },
        guestList: { link: '', notes: '' },
        pressRelease: { link: '', notes: '' },
        media: [],
      },
      step11_performanceShooting: {
        googleDriveLink: '',
        notes: '',
      },
      step12_socialMedia: {
        promotions: [],
      },
      step13_afterEvent: {
        eventSummary: { link: '', notes: '' },
        eventRetrospective: { link: '', notes: '' },
      },
    });

    return NextResponse.json(production, { status: 201, headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error creating production:', error);
    return NextResponse.json(
      { error: 'Failed to create production' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// OPTIONS - Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
