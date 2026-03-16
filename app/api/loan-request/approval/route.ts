import { prisma } from "@/lib/prisma";
import { log } from "console";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const requestParams = await request.json();
        const param = await params;

        log("requestParams", requestParams, param);
        // const loanRequestId = param.id;

        const memberId = requestParams.memberId
        const approved = requestParams.approved
        const loanRequestId = requestParams.loanRequestId

        const updatedLoanRequest = await prisma.loanApproval.update({
            where: {
                loanRequestId_memberId: {
                    loanRequestId, memberId
                }
            },
            data: {
                approved
            }
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
