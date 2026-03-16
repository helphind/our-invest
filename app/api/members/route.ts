import { prisma } from "@/lib/prisma";
import { log } from "console";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const memberData = {
            name: body.name,
            email: body.email,
            phone: body.phone || null,
            isActive: body.isActive !== undefined ? body.isActive : true,
        };

        const member = await prisma.member.upsert({
            where: { id: body.id || "" },
            update: memberData,
            create: memberData,
        });

        return NextResponse.json(member);
    } catch (error) {
        return NextResponse.json(
            {
                message: "Failed to create member",
                error: error,
            },
            { status: 500 },
        );
    }
}

export async function GET() {
    const members = await prisma.member.findMany({
        where: { isActive: true },
    });

    return NextResponse.json(members);
}

