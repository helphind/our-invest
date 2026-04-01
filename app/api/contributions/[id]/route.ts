import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const param = await params;
        const contributionId = await param.id;
        await prisma.contribution.delete({
            where: { id: contributionId },
        });

        return NextResponse.json({
            message: "Contribution deleted successfully",
        });
    } catch (error) {
        console.log("Error deleting contribution:", error);
        return NextResponse.json(
            {
                message: "Failed to delete contribution",
                error: error,
            },
            { status: 500 },
        );
    }
}
