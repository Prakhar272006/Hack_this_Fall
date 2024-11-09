import { NextResponse } from "next/server";
import { db } from "@/utils/db";

export async function GET() {
  try {
    const totalAssets = await db.asset.count();
    const buyPrice = await db.asset.aggregate({
      _sum: {
        buyPrice: true,
      },
    });
    const maintainPrice = await db.asset.aggregate({
      _sum: {
        maintenancePrice: true,
      },
    });

    const assetValue =
      (Number(buyPrice._sum.buyPrice) || 0) +
      (Number(maintainPrice._sum.maintenancePrice) || 0);

    const assetStatus = await db.asset.findMany({
      where: {
        status: {
          in: ["Operational", "In Service"],
        },
      },
    });

    const assetUtilize = await db.asset.findMany({
      where: {
        status: {
          equals: "In Service",
        },
      },
    });

    const assetCondition =
      assetStatus.length > 0
        ? parseFloat(((assetStatus.length / totalAssets) * 100).toFixed(2))
        : 0;
    const assetUtilization =
      assetUtilize.length > 0
        ? parseFloat(((assetUtilize.length / totalAssets) * 100).toFixed(2))
        : 0;

    return NextResponse.json({
      totalAssets,
      assetValue,
      assetCondition,
      assetUtilization,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Error fetching reports" },
      { status: 500 }
    );
  }
}
