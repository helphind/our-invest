import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const loanRequestData = await request.json();

        const memberId = loanRequestData.memberId;
        const amount = parseFloat(loanRequestData.amount);
        const loanType = loanRequestData.loanType;

        const loan = await prisma.loanRequest.create({
            data: {
                memberId,
                amount,
                loanType,
            },
        });

        return NextResponse.json({
            message: "Loan request processed successfully",
            loan,
        });
    } catch (error) {
        console.log("Error processing loan request:", error);
        return NextResponse.json(
            {
                message: "Failed to process loan request",
                error: error,
            },
            { status: 500 },
        );
    }
}



