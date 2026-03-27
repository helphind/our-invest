import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
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

    const allContributions = contributions.map((contribution) => ({
        ...contribution,
        amount: Number(contribution.amount),
    }));

    return NextResponse.json({ data: allContributions });
}
