import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        await prisma.member.delete({ where: { id } });

        return NextResponse.json({ message: "Member deleted successfully" });
    } catch (error) {
        return NextResponse.json(
            {
                message: "Failed to delete member",
                error: error,
            },
            { status: 500 },
        );
    }
}
