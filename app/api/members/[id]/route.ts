import { prisma } from "@/lib/prisma";
import { log } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;

        const loanCount = await prisma.loanRequest.count({
            where: { memberId: id },
        });

        if (loanCount > 0) {
            return NextResponse.json(
                {
                    message: "Cannot delete member with existing loan requests",
                },
                { status: 500 },
            );
        }

        await prisma.member.delete({ where: { id } });

        return NextResponse.json({ message: "Member deleted successfully" });
    } catch (error) {
        log("Error deleting member:", error);
        return NextResponse.json(
            {
                message: "Failed to delete member",
                error: error,
            },
            { status: 500 },
        );
    }
}
