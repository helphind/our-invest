import { prisma } from "@/lib/prisma";

async function main() {
    const members = [
        {
            name: "Bala",
            email: "bala@gmail.com",
            phone: "9843240950",
        },
        {
            name: "Helphin",
            email: "hellokelbin@gmail.com",
            phone: "8056890656",
        },
        {
            name: "Kathiresan",
            email: "kathir@gmail.com",
            phone: "9786306707",
        },
        {
            name: "Kumar",
            email: "kumar@gmail.com",
            phone: "8072604283",
        },
        {
            name: "Logan",
            email: "logan@gmail.com",
            phone: "9790223344",
        },
        {
            name: "Marimuthu",
            email: "mari@gmail.com",
            phone: "7904837893",
        },
        {
            name: "Parthipan",
            email: "parthi@gmail.com",
            phone: "7022253272",
        },
        {
            name: "Samayakumar",
            email: "samayam@gmail.com",
            phone: "9367164043",
        },
        {
            name: "Selvakumar",
            email: "selva@gmail.com",
            phone: "9944666876",
        },
        {
            name: "Ramakrishnan",
            email: "ramki@gmail.com",
            phone: "9789091670",
        },
        {
            name: "Rengarajan",
            email: "reng@gmail.com",
            phone: "9944335643",
        },
    ];

    for (const member of members) {
        await prisma.member.upsert({
            where: { email: member.email },
            update: {}, // do nothing if exists
            create: member,
        });
    }

    console.log("✅ Members seeded successfully");
}

main()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
