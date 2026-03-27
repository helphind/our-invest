import { prisma } from "@/lib/prisma";
import { log } from "console";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const { id } = await params;

        const req = await request.json();

        const status = req.status;

        log('status', status)

        await prisma.contribution.update({
            where: {
                id,
            },
            data: {
                status,
            },
        });

        return NextResponse.json({ message: `Contribution marked as ${status}` });
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
