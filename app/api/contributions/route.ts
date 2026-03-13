import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const contributionData = await request.json();
        console.log("Received contribution data:", contributionData);

        const monthInput = contributionData.month;

        const month = new Date(`${monthInput}-01`);

        await prisma.contribution.create({
            data: {
                memberId: contributionData.memberId,
                month: month,
                amount: contributionData.amount,
                status: "PENDING",
            },
        });

        return NextResponse.json({
            message: "Contribution added successfully",
        });
    } catch (error) {
        console.log("Error processing contribution data:", error);
        return NextResponse.json(
            JSON.stringify({
                message: "Failed to process contribution request",
                error: error,
            }),
            { status: 500 },
        );
    }
}
