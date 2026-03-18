import { prisma } from "@/lib/prisma";
import { log } from "console";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { id: string } },
) {
    try {
        const reqBody = await req.json();
        const param = await params;

        log("reqBody", reqBody, param);

        await prisma.$transaction(async (tx) => {
            const emi = await tx.eMI.findUnique({
                where: { id: param.id },
            });

            if (!emi || emi.status === "PAID") {
                throw new Error("Invalid EMI");
            }

            await tx.eMI.update({
                where: {
                    id: param.id,
                },
                data: {
                    status: "PAID",
                    paidDate: new Date(),
                },
            });

            await tx.loan.update({
                where: { id: emi.loanId },
                data: {
                    remainingPrincipal: {
                        decrement: emi.principal, // ✅ only principal
                    },
                    remainingPayable: {
                        decrement: emi.amount
                    }
                },
            });
        });

        return NextResponse.json({
            success: true,
            message: "EMI marked as paid",
        });
    } catch (err) {
        return NextResponse.json(
            { message: "Failed to mark EMI as paid", error: err },
            { status: 500 },
        );
    }
}
