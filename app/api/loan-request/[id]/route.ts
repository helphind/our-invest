import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
    request: Request,
    { params }: { params: { id: string } },
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
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const loanRequestId = params.id;
        await prisma.loanRequest.delete({
            where: { id: loanRequestId },
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
