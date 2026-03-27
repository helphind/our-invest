import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
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

    const monthlyContributions = contributions.map((contribution) => ({
        ...contribution,
        amount: Number(contribution.amount),
    }));

    return NextResponse.json({ data: monthlyContributions });
}