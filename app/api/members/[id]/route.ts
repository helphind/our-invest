import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const member = await prisma.member.findUnique({
        where: { id },
    });
    return NextResponse.json(member);
}

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
        return NextResponse.json(
            {
                message: "Failed to delete member",
                error: error,
            },
            { status: 500 },
        );
    }
}
