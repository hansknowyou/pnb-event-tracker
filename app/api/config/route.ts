import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Config from '@/lib/models/Config';

export async function GET() {
  try {
    await connectDB();
    const config = await Config.findOne({ key: 'baseUrl' });
    return NextResponse.json({ baseUrl: config?.value || '' });
  } catch (error) {
    console.error('Config GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { baseUrl } = body;

    if (!baseUrl) {
      return NextResponse.json({ error: 'Base URL is required' }, { status: 400 });
    }

    await connectDB();
    const config = await Config.findOneAndUpdate(
      { key: 'baseUrl' },
      { value: baseUrl },
      { upsert: true, new: true }
    );

    return NextResponse.json({ baseUrl: config.value });
  } catch (error) {
    console.error('Config POST error:', error);
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 });
  }
}
