import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const loanRequestData = await request.json();
        console.log("Received loan request data:", loanRequestData);

        const memberId = loanRequestData.memberId;
        const durationMonths = loanRequestData.duration;
        const principal = parseFloat(loanRequestData.amount);
        const loanType = loanRequestData.loanType;

        let interestRate = 8.0;
        if(loanType === "INSTANT") {
            interestRate = 12.0; // Higher interest rate for instant loans
        }
        
        const interest = (principal * interestRate) / 100;
        const totalAmount = principal + interest;
        const remainingAmount = totalAmount;

        const loan = await prisma.loan.create({
            data: {
                memberId,
                durationMonths,
                principal,
                interestRate,
                totalAmount,
                remainingAmount,
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

export async function PUT(request: Request) {
    try {
        const loanRequestData = await request.json();
        console.log("Received loan request data:", loanRequestData);

        const id = loanRequestData.id;
        const memberId = loanRequestData.memberId;
        const durationMonths = loanRequestData.duration;
        const principal = parseFloat(loanRequestData.amount);
        const loanType = loanRequestData.loanType;

        let interestRate = 8.0;
        if(loanType === "INSTANT") {
            interestRate = 12.0; // Higher interest rate for instant loans
        }
        
        const interest = (principal * interestRate) / 100;
        const totalAmount = principal + interest;
        const remainingAmount = totalAmount;

        const loan = await prisma.loan.update({
            where: { id },
            data: {
                memberId,
                durationMonths,
                principal,
                interestRate,
                totalAmount,
                remainingAmount,
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
