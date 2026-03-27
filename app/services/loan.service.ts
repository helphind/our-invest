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
        orderBy: {
            startDate: 'desc'
        }
    });

    return loans.map((loan) => ({
        ...loan,
        principal: Number(loan.principal),
        remainingPrincipal: Number(loan.remainingPrincipal),
        interestRate: Number(loan.interestRate),
        totalPayable: Number(loan.totalPayable),
        remainingPayable: Number(loan.remainingPayable),
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

export async function getClosedLoansCount() {
    return prisma.loan.count({
        where: { status: "CLOSED", loanType: "NORMAL" },
    });
}

export async function getHoldLoansCount() {
    return prisma.loan.count({
        where: { status: "HOLD", loanType: "NORMAL" },
    });
}

export async function getActiveInstantLoansCount() {
    return prisma.loan.count({
        where: { status: "ACTIVE", loanType: "INSTANT" },
    });
}
