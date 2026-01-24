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
        photos: { link: '', notes: '' },
        actorPhotos: { link: '', notes: '' },
        otherPhotos: { link: '', notes: '' },
        logos: { link: '', notes: '' },
        texts: { link: '', longDescription: '', shortDescription: '' },
      },
      step6_venueInfo: [],
      step7_designs: {
        backdrop: {
          sourceFile: '',
          pdfFile: '',
          pngFile: '',
          qrCodes: '',
          trackingQrCodes: '',
          notes: '',
        },
        rollupBanner: {
          sourceFile: '',
          pdfFile: '',
          pngFile: '',
          qrCodes: '',
          trackingQrCodes: '',
          notes: '',
        },
      },
      step8_promotionalImages: {
        poster16_9: [],
        thumbnail1_1: [],
        poster1_1: [],
        poster9_16: [],
        poster4_3: [],
        cover5_2: [],
      },
      step9_videos: {
        conferenceLoop: { link: '', notes: '' },
        mainPromo: { link: '', notes: '' },
        actorIntro: { link: '', notes: '' },
      },
      step10_pressConference: {
        venue: { datetime: '', location: '', notes: '' },
        invitation: { link: '', notes: '' },
        guestList: { link: '', notes: '' },
        pressRelease: { link: '', notes: '' },
        backdropVideo: { link: '', notes: '' },
        backgroundMusic: { link: '', notes: '' },
        screenContent: { link: '', notes: '' },
        rollupBannerPDF: { link: '', isPrinted: false, notes: '' },
        smallPoster: { link: '', isPrinted: false, notes: '' },
        onSiteFootage: { closeUps: '', scenery: '', notes: '' },
      },
      step11_performanceShooting: {
        googleDriveLink: '',
        notes: '',
      },
      step12_socialMedia: {
        websiteUpdated: { isAdded: false, link: '', notes: '' },
        platforms: [],
        facebookEvent: { link: '', notes: '' },
      },
      step13_advertising: {
        online: [],
        offline: [],
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
