import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ProductionStepConfig from '@/lib/models/ProductionStepConfig';
import { getDefaultStepConfig, STEP_DEFINITIONS } from '@/types/productionStepConfig';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET - Retrieve step configuration
export async function GET() {
  try {
    await connectDB();

    // Get or create the singleton configuration
    let config = await ProductionStepConfig.findOne();
    if (!config) {
      config = await ProductionStepConfig.create({ steps: getDefaultStepConfig() });
    }

    // Merge with step definitions to ensure all steps are present
    // (in case new steps were added to code)
    const existingStepKeys = new Set(config.steps.map((s: { stepKey: string }) => s.stepKey));
    const mergedSteps = [...config.steps];

    for (const def of STEP_DEFINITIONS) {
      if (!existingStepKeys.has(def.stepKey)) {
        mergedSteps.push({
          stepKey: def.stepKey,
          order: def.defaultOrder,
          enabled: true,
          requiresVenue: def.requiresVenue,
        });
      }
    }

    // Sort by order
    mergedSteps.sort((a, b) => a.order - b.order);

    // Include step definitions for UI display
    const response = {
      _id: config._id,
      steps: mergedSteps,
      definitions: STEP_DEFINITIONS,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt,
    };

    return NextResponse.json(response, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching step config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch step configuration' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PUT - Update step configuration
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { steps } = body;

    if (!steps || !Array.isArray(steps)) {
      return NextResponse.json(
        { error: 'Invalid steps data' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate that all step keys are valid
    const validStepKeys = new Set(STEP_DEFINITIONS.map((d) => d.stepKey));
    for (const step of steps) {
      if (!validStepKeys.has(step.stepKey)) {
        return NextResponse.json(
          { error: `Invalid step key: ${step.stepKey}` },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    // Update or create the configuration
    let config = await ProductionStepConfig.findOne();
    if (config) {
      config.steps = steps;
      await config.save();
    } else {
      config = await ProductionStepConfig.create({ steps });
    }

    return NextResponse.json(config, { headers: corsHeaders });
  } catch (error) {
    console.error('Error updating step config:', error);
    return NextResponse.json(
      { error: 'Failed to update step configuration' },
      { status: 500, headers: corsHeaders }
    );
  }
}
