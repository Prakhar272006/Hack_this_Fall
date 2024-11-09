import { NextResponse } from 'next/server';
import { processExcelData } from '@/utils/excel';
import { db } from '@/utils/db';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const assetData = await processExcelData(Buffer.from(buffer));

    const createdAssets = await Promise.all(
      assetData.data.map(async (asset: any) => {
        return await db.asset.create({
          data: {
            name: asset.name || '',
            type: asset.type || '',
            location: asset.location || '',
            purchaseDate: asset.purchaseDate ? new Date(asset.purchaseDate) : new Date(),
            lastMaintenance: asset.lastMaintenance ? new Date(asset.lastMaintenance) : null,
            status: asset.status || '',
            departmentId: asset.departmentId || 1,
            buyPrice: asset.buyPrice || 0,
            maintenancePrice: asset.maintenancePrice || 0,
            replacementPrice: asset.replacementPrice || 0,
          },
        });
      })
    );

    return NextResponse.json({ message: 'Data added to database successfully', data: createdAssets });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json({ error: 'Error processing file' }, { status: 500 });
  }
}