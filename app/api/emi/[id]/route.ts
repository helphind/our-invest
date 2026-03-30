import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const param = await params;

        await prisma.$transaction(async (tx) => {
            const emi = await tx.eMI.findUnique({
                where: { id: param.id },
            });

            if (!emi || emi.status === "PAID") {
                throw new Error("Invalid EMI");
            }

            const loanId = emi.loanId;

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
                where: { id: loanId },
                data: {
                    remainingPrincipal: {
                        decrement: emi.principal, // ✅ only principal
                    },
                    remainingPayable: {
                        decrement: emi.amount,
                    },
                },
            });

            const pendingEMICount = await tx.eMI.count({
                where: {
                    loanId: loanId,
                    status: "PENDING",
                },
            });

            // 4. If no pending → close loan
            if (pendingEMICount === 0) {
                await prisma.loan.update({
                    where: { id: loanId },
                    data: { status: "CLOSED" },
                });
            }
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
