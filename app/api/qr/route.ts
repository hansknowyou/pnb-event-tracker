import QRCode from 'qrcode';
import { handleOptions, jsonResponse } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return jsonResponse({ error: 'URL is required' }, { status: 400 });
    }

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    return jsonResponse({ qrCode: qrCodeDataUrl });
  } catch (error) {
    console.error('QR code generation error:', error);
    return jsonResponse({ error: 'Failed to generate QR code' }, { status: 500 });
  }
}
