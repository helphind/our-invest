import { prisma } from "@/lib/prisma";

export async function getAllMembers() {
    return await prisma.member.findMany();
}

export async function getAllActiveMembers() {
    return await prisma.member.findMany({
        where: { isActive: true },
    });
}

export async function getMembersCount() {
    return await prisma.member.count();
}

export async function getActiveMembersCount() {
    return await prisma.member.count({
        where: { isActive: true },
    });
}

