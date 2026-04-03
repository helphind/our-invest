import { prisma } from "@/lib/prisma";

async function main() {
    await prisma.fundConfig.create({
        data: {
            monthlyAmount: 5000,
            isAutoGenerate: true,
        },
    });
}

main();
