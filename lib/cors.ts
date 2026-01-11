import { NextResponse } from 'next/server';

export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

export function handleOptions() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(),
  });
}

export function jsonResponse(data: any, options: { status?: number } = {}) {
  return NextResponse.json(data, {
    status: options.status || 200,
    headers: corsHeaders(),
  });
}
