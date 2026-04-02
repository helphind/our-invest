import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const members = await prisma.member.findMany({
        orderBy: {
            name: "asc",
        },
    });

    return NextResponse.json(members);
}
