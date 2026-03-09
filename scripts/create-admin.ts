import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

async function main() {
    const password = await hash("admin123", 10);

    await prisma.user.create({
        data: {
            name: "Admin",
            email: "admin@test.com",
            password,
        },
    });
}

main();
