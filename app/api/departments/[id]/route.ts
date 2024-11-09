import { NextResponse } from 'next/server';
import { db } from '@/utils/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const department = await db.department.findUnique({
    where: { id: Number(id) },
    include: { assets: true },
  });

  if (!department) {
    return NextResponse.json({ error: 'Department not found' }, { status: 404 });
  }

  return NextResponse.json(department);
}