import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;

        const req = await request.json();

        const status = req.status;

        await prisma.contribution.update({
            where: {
                id,
            },
            data: {
                status,
            },
        });

        return NextResponse.json({
            message: `Contribution marked as ${status}`,
        });
    } catch (error) {
        console.error("Error marking contribution as paid:", error);
        return NextResponse.json(
            { error: "Failed to mark contribution as paid" },
            {
                status: 500,
            },
        );
    }
}
