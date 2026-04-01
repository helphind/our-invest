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
            approved: true,
        },
    });

    const activeMembers = await getActiveMembersCount();

    const requiredApprovals = Math.ceil(activeMembers * 0.5);

    if (approvals >= requiredApprovals) {
        await prisma.loanRequest.update({
            where: { id: loanRequestId },
            data: { status: "APPROVED" },
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
            <div className="mb-6">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Loan Summary
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Borrower */}
                    <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50 shadow-sm hover:shadow-md transition">
                        <p className="text-xs text-blue-600 mb-1">Borrower</p>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                                {loanRequest.member.name?.charAt(0)}
                            </div>
                            <p className="font-semibold text-gray-800">
                                {loanRequest.member.name}
                            </p>
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="p-4 rounded-2xl border border-green-100 bg-green-50 shadow-sm hover:shadow-md transition">
                        <p className="text-xs text-green-600 mb-1">Amount</p>
                        <p className="text-lg font-semibold text-gray-900">
                            {loanRequest.amount
                                ? currency.format(Number(loanRequest.amount))
                                : "-"}
                        </p>
                    </div>

                    {/* Status */}
                    <div className="p-4 rounded-2xl border border-purple-100 bg-purple-50 shadow-sm hover:shadow-md transition">
                        <p className="text-xs text-purple-600 mb-1">Status</p>

                        <span
                            className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full
        ${
            loanRequest.status === "APPROVED"
                ? "bg-green-100 text-green-700"
                : loanRequest.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
        }`}
                        >
                            ● {loanRequest.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Approval Table Section Start */}

            <div className="w-full mt-6">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Approver list
                    </h3>
                </div>

                {/* ✅ Desktop Table */}
                <div className="hidden md:block overflow-hidden rounded-2xl border bg-white shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-4 text-left">Member</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {members.map((member) => (
                                <tr
                                    key={member.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4">{member.name}</td>

                                    <td className="px-6 py-4 text-xs rounded-full">
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

                                    <td className="px-6 py-4 flex justify-end gap-2">
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

                {/* ✅ Mobile Cards */}
                <div className="md:hidden space-y-4">
                    {members.map((member) => (
                        <div
                            key={member.id}
                            className="p-4 rounded-2xl border bg-white shadow-sm"
                        >
                            {/* Top Row */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        {member.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {member.email}
                                    </p>
                                </div>

                                <span
                                    className={`px-3 py-1 rounded-full text-sm ${
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
                                        : member.approvals?.[0]?.approved ===
                                            false
                                          ? "Rejected"
                                          : "Pending"}
                                </span>
                            </div>

                            {/* Divider */}
                            <div className="my-3 border-t"></div>

                            {/* Actions */}
                            {member.approvals.length === 0 && (
                                <div className="flex justify-end gap-2">
                                    <form
                                        className="inline-flex"
                                        action={approveReject}
                                    >
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
                                            className=" py-2 px-3 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                                        >
                                            Approve
                                        </button>
                                    </form>

                                    <form
                                        className="inline-flex"
                                        action={approveReject}
                                    >
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
                                            className="py-2 px-3 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                            Reject
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
