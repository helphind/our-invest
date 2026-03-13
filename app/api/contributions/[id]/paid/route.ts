import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const { id } = await params;

        await prisma.contribution.update({
            where: {
                id,
            },
            data: {
                status: "PAID",
            },
        });

        return NextResponse.json({ message: "Contribution marked as paid" });
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
