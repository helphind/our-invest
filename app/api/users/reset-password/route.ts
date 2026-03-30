import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { token, newPassword } = await req.json();

    const user = await prisma.user.findFirst({
        where: {            
            resetToken: token,
            resetTokenExpiry: {
                gte: new Date(),
            },
        },
    });

    if (!user) {
        return NextResponse.json(
            { error: "Invalid or expired token" },
            { status: 400 },
        );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null,
        },
    });

    return NextResponse.json({ message: "Password reset successful" });
}
