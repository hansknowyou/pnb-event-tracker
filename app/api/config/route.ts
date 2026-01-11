import connectDB from '@/lib/mongodb';
import Config from '@/lib/models/Config';
import { handleOptions, jsonResponse } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET() {
  try {
    await connectDB();
    const config = await Config.findOne({ key: 'baseUrl' });
    return jsonResponse({ baseUrl: config?.value || '' });
  } catch (error) {
    console.error('Config GET error:', error);
    return jsonResponse({ error: 'Failed to fetch config' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { baseUrl } = body;

    if (!baseUrl) {
      return jsonResponse({ error: 'Base URL is required' }, { status: 400 });
    }

    await connectDB();
    const config = await Config.findOneAndUpdate(
      { key: 'baseUrl' },
      { value: baseUrl },
      { upsert: true, new: true }
    );

    return jsonResponse({ baseUrl: config.value });
  } catch (error) {
    console.error('Config POST error:', error);
    return jsonResponse({ error: 'Failed to save config' }, { status: 500 });
  }
}
