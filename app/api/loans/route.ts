import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const loanRequestData = await request.json();
        const formattedData = getDataFromRequest(loanRequestData);

        const loan = await prisma.loan.create({
            data: formattedData,
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
        const id = loanRequestData.id;
        const formattedData = getDataFromRequest(loanRequestData);
        console.log("Received loan request data:", formattedData);

        const loan = await prisma.loan.update({
            where: { id },
            data: formattedData,
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

function getDataFromRequest(loanRequestData: any) {
    console.log("Received loan request data:", loanRequestData);

    const memberId = loanRequestData.memberId;
    const durationMonths = loanRequestData.duration;
    const principal = parseFloat(loanRequestData.amount);
    const loanType = loanRequestData.loanType;
    const emiStartMonth =  loanRequestData.emiStartMonth

    const startDate = new Date(`${emiStartMonth}-01`);

    let interestRate = 8.0;
    if (loanType === "INSTANT") {
        interestRate = 12.0; // Higher interest rate for instant loans
    }

    const monthlyRate = interestRate / 100 / 12;

    const emiAmount =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, durationMonths)) /
        (Math.pow(1 + monthlyRate, durationMonths) - 1);

    const totalAmount = emiAmount * durationMonths;

    const remainingAmount = totalAmount;

    return {
        memberId,
        durationMonths,
        principal,
        interestRate,
        totalAmount,
        remainingAmount,
        emiAmount,
        startDate
    };
}
