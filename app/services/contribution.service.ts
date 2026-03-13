import { prisma } from "@/lib/prisma";
import { log } from "console";

export async function getAllContributions() {
    const contributions = await prisma.contribution.findMany({
        include: {
            member: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: {
            month: "desc",
        },
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
    });

    return contributions.map((contribution) => ({
        ...contribution,
        amount: Number(contribution.amount),
    }));
}

export async function getTotalContributions() {
    const contributions = await prisma.contribution.findMany({
        where: {
            status: "PAID",
        },
    });

    return contributions.reduce((total, contribution) => {
        return total + Number(contribution.amount);
    }, 0);
}

export async function getTotalPendingContributions() {
    const contributions = await prisma.contribution.findMany({
        where: {
            status: "PENDING",
        },
    });

    return contributions.reduce((total, contribution) => {
        return total + Number(contribution.amount);
    }, 0);
}
