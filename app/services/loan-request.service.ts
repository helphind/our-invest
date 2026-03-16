import { prisma } from "@/lib/prisma";

export async function getAllLoanRequests() {
    const loanRequests = await prisma.loanRequest.findMany({
        include: {
            member: {
                select: {
                    name: true,
                },
            },
        },
    });

     return loanRequests.map((loanRequest) => ({
        ...loanRequest,
        amount: Number(loanRequest.amount),
    }));
}
