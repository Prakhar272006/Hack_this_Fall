import { NextResponse } from 'next/server';
import { db } from '@/utils/db';

export async function GET() {
  const departments = await db.department.findMany();
  return NextResponse.json(departments);
}