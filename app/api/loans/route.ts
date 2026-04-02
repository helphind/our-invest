import { EMIStatus, LoanStatus } from "@/app/generated/prisma/enums";
import { createEmiSchedule } from "@/app/services/emi.service";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * 
 * @returns GET All loans
 */
export async function GET() {
    const loans = await prisma.loan.findMany({
        include: {
            member: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: {
            startDate: "desc",
        },
    });

    const formattedLoans = loans.map((loan) => ({
        ...loan,
        principal: Number(loan.principal),
        remainingPrincipal: Number(loan.remainingPrincipal),
        interestRate: Number(loan.interestRate),
        totalPayable: Number(loan.totalPayable),
        remainingPayable: Number(loan.remainingPayable),
        emiAmount: Number(loan.emiAmount),
    }));

    return NextResponse.json(formattedLoans);
}

export async function POST(request: Request) {
    try {
        const loanRequestData = await request.json();
        const formattedData = getDataFromRequest(loanRequestData);

        const loan = await prisma.loan.create({
            data: { ...formattedData },
        });

        await createEmiSchedule(loan);

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

        const status = loanRequestData.status;

        let loan;

        if (status === LoanStatus.CLOSED) {
            await prisma.$transaction(async (tx) => {
                loan = await tx.loan.update({
                    where: { id },
                    data: {
                        status: LoanStatus.CLOSED,
                        remainingPayable: 0,
                        remainingPrincipal: 0,
                    },
                });

                await tx.eMI.updateMany({
                    where: {
                        loanId: id,
                        status: EMIStatus.PENDING,
                    },
                    data: {
                        status: EMIStatus.PAID,
                        paidDate: new Date(),
                    },
                });
            });
        } else {
            const paidEmiCount = await prisma.eMI.count({
                where: {
                    loanId: id,
                    status: EMIStatus.PAID,
                },
            });

            loan = await prisma.loan.update({
                where: { id },
                data: formattedData,
            });

            if (paidEmiCount === 0) {
                await createEmiSchedule(loan);
            }
        }

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
    const emiStartMonth = loanRequestData.emiStartMonth;
    const status = loanRequestData.status || LoanStatus.ACTIVE;

    const startDate = new Date(`${emiStartMonth}-01`);

    let interestRate = 8.0;
    if (loanType === "INSTANT") {
        interestRate = 12.0; // Higher interest rate for instant loans
    }

    const monthlyRate = interestRate / 100 / 12;

    const emiAmount = Math.round(
        (principal * monthlyRate * Math.pow(1 + monthlyRate, durationMonths)) /
            (Math.pow(1 + monthlyRate, durationMonths) - 1),
    );

    const totalPayable = emiAmount * durationMonths;

    const remainingPrincipal = principal;
    const remainingPayable = totalPayable;

    return {
        member: { connect: { id: memberId } },
        durationMonths,
        principal,
        interestRate,
        totalPayable,
        remainingPrincipal,
        remainingPayable,
        emiAmount,
        startDate,
        loanType,
        status
    };
}
