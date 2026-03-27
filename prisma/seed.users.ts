import { Role } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

async function main() {
    console.log("🌱 Seeding started...");

    const usersList = [
        {
            name: "Bala",
            email: "bala@gmail.com",
            password: "9843240950",
            role: Role.MEMBER,
        },
        {
            name: "Helphin",
            email: "hellokelbin@gmail.com",
            password: "8056890656",
            role: Role.MEMBER,
        },
        {
            name: "Kathiresan",
            email: "kathir@gmail.com",
            password: "9786306707",
            role: Role.MEMBER,
        },
        {
            name: "Kumar",
            email: "kumar@gmail.com",
            password: "8072604283",
            role: Role.MEMBER,
        },
        {
            name: "Logan",
            email: "logan@gmail.com",
            password: "9790223344",
            role: Role.MEMBER,
        },
        {
            name: "Marimuthu",
            email: "mari@gmail.com",
            password: "7904837893",
            role: Role.MEMBER,
        },
        {
            name: "Parthipan",
            email: "parthi@gmail.com",
            password: "7022253272",
            role: Role.MEMBER,
        },
        {
            name: "Samayakumar",
            email: "samayam@gmail.com",
            password: "9367164043",
            role: Role.MEMBER,
        },
        {
            name: "Selvakumar",
            email: "selva@gmail.com",
            password: "9944666876",
            role: Role.MEMBER,
        },
        {
            name: "Ramakrishnan",
            email: "ramki@gmail.com",
            password: "9789091670",
            role: Role.MEMBER,
        },
        {
            name: "Rengarajan",
            email: "reng@gmail.com",
            password: "9944335643",
            role: Role.MEMBER,
        },
    ];

    for (const userData of usersList) {
        const userPassword = await hash(userData.password, 10);
        await prisma.member.update({
            where: { email: userData.email },
            data: {
                user: {
                    create: {
                        name: userData.name,
                        username: userData.name.toLowerCase(),
                        password: userPassword,
                        role: Role.MEMBER,
                    },
                },
            },
        });
    }

    console.log("🎉 Seeding completed!");
}

main()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
