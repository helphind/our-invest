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

export async function PUT(request: Request) {
    try {
        const loanRequestData = await request.json();

        const id = loanRequestData.id;
        const memberId = loanRequestData.memberId;
        const amount = parseFloat(loanRequestData.amount);
        const loanType = loanRequestData.loanType;

        const loan = await prisma.loanRequest.update({
            where: { id },
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

/* Method to Get All the loan requests */
export async function GET() {
    const loanRequests = await prisma.loanRequest.findMany({
        include: {
            member: {
                select: {
                    name: true,
                },
            },
        },
        where: {
            isDeleted: false,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const formattedLoanRequests = loanRequests.map((loanRequest) => ({
        ...loanRequest,
        amount: Number(loanRequest.amount),
    }));

    return NextResponse.json(formattedLoanRequests);
}
