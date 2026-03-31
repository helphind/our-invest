import { prisma } from "@/lib/prisma";
import { EMIStatus } from "../generated/prisma/enums";

export async function createEmiSchedule(loan: any) {
    const principal = Number(loan.principal);
    const annualRate = loan.interestRate;
    const months = loan.durationMonths;

    const monthlyRate = annualRate / 100 / 12;

    const emi =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

    let balance = principal;

    const startDate = new Date(loan.startDate);

    const emiList: any[] = [];

    for (let i = 0; i < months; i++) {
        const interest = balance * monthlyRate;
        const principalPart = emi - interest;

        balance -= principalPart;

        const emiDate = new Date(startDate);
        emiDate.setMonth(emiDate.getMonth() + i);

        const emiMonth = emiDate.toISOString().slice(0, 7);

        const emiStartDate = new Date(`${emiMonth}-01`);

        emiList.push({
            loanId: loan.id,
            installmentNo: Number(i + 1),
            amount: Number(emi.toFixed(2)),
            principal: Number(principalPart.toFixed(2)),
            interest: Number(interest.toFixed(2)),
            dueDate: emiStartDate,
            status: EMIStatus.PENDING,
        });
    }

    // await prisma.eMI.createMany({
    //     data: emiList,
    // });

    await prisma.$transaction(async (tx) => {
        await tx.eMI.deleteMany({
            where: { loanId: loan.id },
        });

        if (loan.loanType === "NORMAL") {
            await tx.eMI.createMany({
                data: emiList,
            });
        }
    });
}
