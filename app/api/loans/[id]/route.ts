import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const { id } = await params;

        const loan = await prisma.loan.findUnique({
            where: { id },
            include: {
                member: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return NextResponse.json(loan);
    } catch (error) {
        return NextResponse.json(
            {
                message: "Failed to fetch loan details",
                error: error,
            },
            { status: 500 },
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const { id } = await params;

        await prisma.loan.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Loan deleted successfully" });
    } catch (error) {
        return NextResponse.json(
            {
                message: "Failed to delete loan",
                error: error,
            },
            { status: 500 },
        );
    }
}
