import { prisma } from "@/lib/prisma";

export default async function MemberPage({ params }: any) {
    const param = await params;

    const member = await prisma.member.findUnique({
        where: { id: param.id },
    });

    return (
        <div className="max-w-xl mx-auto mt-12 bg-white shadow-md rounded-xl p-6 border">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                Member Details
            </h1>

            <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500 font-medium">Name</span>
                    <span className="text-gray-800">{member?.name}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500 font-medium">Email</span>
                    <span className="text-gray-800">{member?.email}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Phone</span>
                    <span className="text-gray-800">
                        {member?.phone || "-"}
                    </span>
                </div>
            </div>

            <div className="mt-6 flex gap-3">
                <a
                    href="/members"
                    className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
                >
                    Back
                </a>

                <a
                    href={`/members/edit/${member?.id}`}
                    className="px-4 py-2 text-sm bg-amber-500 text-white rounded-md hover:bg-amber-600"
                >
                    Edit
                </a>
            </div>
        </div>
    );
}
