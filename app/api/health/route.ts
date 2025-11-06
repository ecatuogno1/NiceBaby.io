import { NextResponse } from 'next/server';
import { trackRequest } from '../metrics/route';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const response = NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
  trackRequest(request.method, response.status);
  return response;
}
