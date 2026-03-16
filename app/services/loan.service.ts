import { prisma } from "@/lib/prisma";

export async function getAllLoans() {
    const loans = await prisma.loan.findMany({
        include: {
            member: {
                select: {
                    name: true,
                },
            },
        },
    });

    return loans.map((loan) => ({
        ...loan,
        principal: Number(loan.principal),
        interestRate: Number(loan.interestRate),
        totalAmount: Number(loan.totalAmount),
        remainingAmount: Number(loan.remainingAmount),
        emiAmount: Number(loan.emiAmount),
    }));
}

export async function getActiveLoans() {
    return prisma.loan.findMany({
        where: { status: "ACTIVE" },
        include: {
            member: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
}

export async function getActiveLoansCount() {
    return prisma.loan.count({
        where: { status: "ACTIVE", loanType: "NORMAL" },
    });
}

export async function getActiveInstantLoansCount() {
    return prisma.loan.count({
        where: { status: "ACTIVE", loanType: "INSTANT" },
    });
}
