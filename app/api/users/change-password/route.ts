import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: "Missing fields" },
                { status: 400 },
            );
        }

        // 🔍 Get user
        const member = await prisma.member.findUnique({
            where: { email: session.user.email },
            include: { user: true },
        });

        if (!member) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 },
            );
        }

        // 🔐 Verify current password
        const isValid = await bcrypt.compare(
            currentPassword,
            String(member.user?.password),
        );

        if (!isValid) {
            return NextResponse.json(
                { error: "Current password is incorrect" },
                { status: 400 },
            );
        }

        // 🔒 Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 💾 Update
        await prisma.user.update({
            where: { id: member.user?.id },
            data: { password: hashedPassword },
        });

        return NextResponse.json({ message: "Password updated successfully" });
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }
}
