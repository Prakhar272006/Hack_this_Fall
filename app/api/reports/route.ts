import { NextResponse } from 'next/server';
import { db } from '@/utils/db';

export async function GET() {
  try {
    const reports = await db.communityReport.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Error fetching reports' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newReport = await db.communityReport.create({
      data: {
        reporterName: data.reporterName,
        issue: data.issue,
        status: 'New',
        department: data.department,
      },
    });
    return NextResponse.json(newReport);
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json({ error: 'Error creating report' }, { status: 500 });
  }
}