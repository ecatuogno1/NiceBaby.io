import client from 'prom-client';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const register = client.register;

if (!(global as any).__METRICS_DEFAULTS__) {
  client.collectDefaultMetrics({ register });
  (global as any).__METRICS_DEFAULTS__ = true;
}

let httpRequestCounter = register.getSingleMetric('http_requests_total') as client.Counter | undefined;
if (!httpRequestCounter) {
  httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Count of HTTP requests by status code',
    labelNames: ['method', 'status'],
  });
}

export async function GET() {
  return new NextResponse(await register.metrics(), {
    status: 200,
    headers: {
      'Content-Type': register.contentType,
      'Cache-Control': 'no-store',
    },
  });
}

export function trackRequest(method: string, status: number) {
  httpRequestCounter?.inc({ method, status: status.toString() });
}
