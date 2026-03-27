import { prisma } from "@/lib/prisma";

export async function getAllContributions() {
    const contributions = await prisma.contribution.findMany({
        include: {
            member: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: [
            { month: "desc" },
            {
                member: {
                    name: "asc",
                },
            },
        ],
    });

    return contributions.map((contribution) => ({
        ...contribution,
        amount: Number(contribution.amount),
    }));
}

export async function getCurrentMonthContributions() {
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const contributions = await prisma.contribution.findMany({
        where: {
            month: {
                gte: startOfMonth,
                lt: endOfMonth,
            },
        },
        include: {
            member: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: {
            member: {
                name: "asc",
            },
        },
    });

    return contributions.map((contribution) => ({
        ...contribution,
        amount: Number(contribution.amount),
    }));
}

export async function getTotalContributions() {
    const contributions = await prisma.contribution.aggregate({
        where: {
            status: "PAID",
        },
        _sum: {
            amount: true,
        },
    });

    return contributions._sum.amount;
}

export async function getTotalPendingContributions() {
    const contributions = await prisma.contribution.aggregate({
        where: {
            status: "PENDING",
        },
        _sum: {
            amount: true,
        },
    });

    return contributions._sum.amount;
}

export async function getTotalSkippedContributions() {
    const contributions = await prisma.contribution.aggregate({
        where: {
            status: "SKIPPED",
        },
        _sum: {
            amount: true,
        },
    });

    return contributions._sum.amount;
}

export async function getTotalInterests() {
    const contributions = await prisma.eMI.aggregate({
        where: {
            status: "PAID",
        },
        _sum: {
            interest: true,
        },
    });

    return contributions._sum.interest;
}

export async function getTotalReturns() {
    const contributions = await getTotalContributions();
    const interest = await getTotalInterests();

    const total = Number(contributions) + Number(interest);

    return total;
}

export async function getAvailableAmountForLoan() {
    const loanSum = await prisma.loan.aggregate({
        _sum: { remainingPrincipal: true },
    });

    const totalContribution = await getTotalReturns();
    const totalLoan = Number(loanSum._sum.remainingPrincipal || 0);

    const availableAmount = totalContribution - totalLoan;

    return availableAmount;
}
