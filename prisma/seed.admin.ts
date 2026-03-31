import { Role } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

async function main() {
    const password = await hash("ocet@2007", 10);

    // await prisma.user.create({
    //     data: {
    //         name: "Admin",
    //         username: "admin",
    //         password,
    //         role: Role.ADMIN,
    //     },
    // });

    await prisma.user.update({
        where: {
            username: "admin",
        },
        data: {
            password,
        },
    });
}

main();
