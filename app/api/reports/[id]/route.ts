import { NextResponse } from 'next/server';
import { db } from '@/utils/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const report = await db.communityReport.findUnique({
      where: { id: Number(params.id) },
    });
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }
    return NextResponse.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json({ error: 'Error fetching report' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const updatedReport = await db.communityReport.update({
      where: { id: Number(params.id) },
      data: {
        status: data.status,
        resolution: data.resolution,
      },
    });
    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json({ error: 'Error updating report' }, { status: 500 });
  }
}