import { prisma } from "@/lib/prisma";
import { log } from "console";

function parseMonth(input?: string) {
    if (!input) {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const [year, month] = input.split("-").map(Number);
    return new Date(year, month - 1, 1);
}

export async function generateMonthlyContributions(monthInput?: string) {
    const fund = await prisma.fundConfig.findFirst();

    log('fund', fund)

    if (!fund?.isAutoGenerate) {
        return { message: "Auto generation disabled" };
    }

    const monthStart = parseMonth(monthInput);

    const members = await prisma.member.findMany({
        where: { isActive: true },
    });

    let created = 0;

    for (const member of members) {
        try {
            await prisma.contribution.create({
                data: {
                    memberId: member.id,
                    amount: fund.monthlyAmount,
                    month: monthStart,
                    status: "PENDING",
                },
            });
            created++;
        } catch {
            // ignore duplicate (unique constraint)
        }
    }

    await prisma.fundConfig.update({
        where: { id: fund.id },
        data: { lastRunAt: new Date() },
    });

    return {
        message: "Contributions generated",
        month: monthStart,
        created,
    };
}
