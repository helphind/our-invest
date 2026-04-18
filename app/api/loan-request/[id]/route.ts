import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;

        const loanRequest = await prisma.loanRequest.findUnique({
            where: { id },
            include: {
                member: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return NextResponse.json(loanRequest);
    } catch (error) {
        return NextResponse.json(
            {
                message: "Failed to fetch loan request details",
                error: error,
            },
            { status: 500 },
        );
    }
}

// Need to check this method is used or not
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { status } = await request.json();
        const param = await params;
        const loanRequestId = param.id;

        const updatedLoanRequest = await prisma.loanRequest.update({
            where: { id: loanRequestId },
            data: { status },
        });

        return NextResponse.json({
            message: "Loan request updated successfully",
            loanRequest: updatedLoanRequest,
        });
    } catch (error) {
        console.log("Error updating loan request:", error);
        return NextResponse.json(
            {
                message: "Failed to update loan request",
                error: error,
            },
            { status: 500 },
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const param = await params;
        const loanRequestId = await param.id;

        await prisma.loanRequest.update({
            where: { id: loanRequestId },
            data: { isDeleted: true, deletedAt: new Date() },
        });

        return NextResponse.json({
            message: "Loan request deleted successfully",
        });
    } catch (error) {
        console.log("Error deleting loan request:", error);
        return NextResponse.json(
            {
                message: "Failed to delete loan request",
                error: error,
            },
            { status: 500 },
        );
    }
}
