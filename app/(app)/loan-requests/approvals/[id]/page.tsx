"use server";

import { getActiveMembersCount } from "@/app/services/member.service";
import { currency } from "@/app/services/utility.service";
import { prisma } from "@/lib/prisma";
import { log } from "console";
import { revalidatePath } from "next/cache";

export async function approveReject(formData: FormData): Promise<void> {
    const loanRequestId = formData.get("loanRequestId") as string;
    const memberId = formData.get("memberId") as string;
    const actionType = formData.get("actionType");
    const comment = formData.get("comment") as string;

    try {
        await prisma.loanApproval.create({
            data: {
                loanRequestId,
                memberId,
                approved: actionType === "approve" ? true : false,
                comment,
            },
        });

        await checkApproval(loanRequestId);

        revalidatePath(`/loan-requests/approvals/${loanRequestId}`);
    } catch (err) {
        log("error", err);
    }
}

export async function checkApproval(loanRequestId: string) {
     // check approval count
  const approvals = await prisma.loanApproval.count({
    where: {
      loanRequestId,
      approved: true
    }
  });

  const activeMembers = await getActiveMembersCount();

  const requiredApprovals = Math.ceil(activeMembers * 0.5);


  if (approvals >= requiredApprovals) {
    await prisma.loanRequest.update({
      where: { id: loanRequestId },
      data: { status: "APPROVED" }
    });
  }
}

export default async function LoanApprovalsPage({
    params,
}: {
    params: { id: string };
}) {
    const param = await params;
    const loanRequestId = param.id;

    const loanRequest = await prisma.loanRequest.findUnique({
        where: { id: loanRequestId },
        include: {
            member: true,
            approvals: true,
        },
    });

    const members = await prisma.member.findMany({
        where: {
            id: { not: loanRequest?.memberId },
        },
        include: {
            approvals: {
                where: {
                    loanRequestId: loanRequestId,
                },
            },
        },
    });

    console.log("members", members, loanRequest);

    if (!loanRequest) return <div>Loan Request not found</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">Loan Request Approvals</h1>

            <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                    <p className="text-gray-500">Borrower</p>
                    <p className="font-medium">{loanRequest.member.name}</p>
                </div>

                <div>
                    <p className="text-gray-500">Amount</p>
                    <p className="font-medium">
                        {loanRequest.amount ? currency.format(Number(loanRequest.amount)) : '-'}
                    </p>
                </div>

                <div>
                    <p className="text-gray-500">Status</p>
                    <p className="font-medium">{loanRequest.status}</p>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg border overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600">
                        <tr>
                            <th className="text-left p-3">Member</th>
                            <th className="text-left p-3">Status</th>
                            <th className="text-right p-3">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {members.map((member) => (
                            <tr key={member.id} className="border-t">
                                <td className="p-3">{member.name}</td>

                                <td className="p-3 text-xs rounded-full">
                                    <span
                                        className={`px-2 py-1 rounded-full text-sm ${
                                            member.approvals?.[0]?.approved
                                                ? "bg-green-100 text-green-800"
                                                : member.approvals?.[0]
                                                        ?.approved === false
                                                  ? "bg-red-100 text-red-800"
                                                  : "bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                        {member.approvals?.[0]?.approved
                                            ? "Approved"
                                            : member.approvals?.[0]
                                                    ?.approved === false
                                              ? "Rejected"
                                              : "Pending"}
                                    </span>
                                </td>

                                <td className="flex justify-end gap-2 p-3">
                                    {member.approvals.length === 0 && (
                                        <>
                                            <form action={approveReject}>
                                                <input
                                                    type="hidden"
                                                    name="loanRequestId"
                                                    value={loanRequestId}
                                                />
                                                <input
                                                    type="hidden"
                                                    name="memberId"
                                                    value={member.id}
                                                />
                                                <input
                                                    type="hidden"
                                                    name="actionType"
                                                    value="approve"
                                                />

                                                <button
                                                    type="submit"
                                                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                                                >
                                                    Approve
                                                </button>
                                            </form>

                                            <form action={approveReject}>
                                                <input
                                                    type="hidden"
                                                    name="loanRequestId"
                                                    value={loanRequestId}
                                                />
                                                <input
                                                    type="hidden"
                                                    name="memberId"
                                                    value={member.id}
                                                />
                                                <input
                                                    type="hidden"
                                                    name="actionType"
                                                    value="reject"
                                                />

                                                <button
                                                    type="submit"
                                                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                                                >
                                                    Reject
                                                </button>
                                            </form>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
