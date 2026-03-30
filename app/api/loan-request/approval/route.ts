import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest
) {
    try {
        const requestParams = await request.json();

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
