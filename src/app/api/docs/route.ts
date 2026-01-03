import { NextResponse } from 'next/server';
import { swaggerSpec } from '@/lib/swagger/config';

/**
 * GET /api/docs
 * Swagger JSON 스펙 반환
 */
export async function GET() {
  return NextResponse.json(swaggerSpec);
}

