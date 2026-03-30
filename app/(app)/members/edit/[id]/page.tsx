import MemberForm from "@/app/components/members/MemberForm";
import { Member } from "@/app/interface/Member.type";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MemberEditPage({ params }: any) {
    const param = await params;

    const member: Member | null = await prisma.member.findUnique({
        where: { id: param.id }
    });

    return (
        <div className="max-w-xl mx-auto mt-12 bg-white shadow-md rounded-xl border p-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                Edit Member
            </h1>

            <MemberForm member={member} />
        </div>
    );
}
