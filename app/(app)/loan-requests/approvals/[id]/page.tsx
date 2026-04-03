"use server";

import { ActionButtons } from "@/app/components/loans/Approval/ActionButtons";
import { getStatus } from "@/app/components/loans/Approval/ApprovalStatus";
import { StatusBadge } from "@/app/components/loans/Approval/StatusBadge";
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

            <div className="w-full pt-4">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Approver list
                    </h3>
                </div>

                {/* ✅ Desktop Table */}
                <div className="hidden md:block rounded-2xl border bg-white shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-4 text-left">Member</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {members.map((member) => {
                                const status = getStatus(member);

                                return (
                                    <tr
                                        key={member.id}
                                        className="hover:bg-gray-50 transition"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-800">
                                                    {member.name}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {member.email}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <StatusBadge status={status} />
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <ActionButtons
                                                member={member}
                                                loanRequestId={loanRequestId}
                                                approveReject={approveReject}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* ✅ Mobile Cards */}
                <div className="md:hidden space-y-4">
                    {members.map((member) => {
                        const status = getStatus(member);

                        return (
                            <div
                                key={member.id}
                                className="p-4 rounded-2xl border bg-white shadow-sm space-y-3"
                            >
                                {/* Top */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            {member.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {member.email}
                                        </p>
                                    </div>

                                    <StatusBadge status={status} />
                                </div>

                                {/* Divider */}
                                <div className="border-t"></div>

                                {/* Actions */}
                                <div className="flex justify-end">
                                    <ActionButtons
                                        member={member}
                                        loanRequestId={loanRequestId}
                                        approveReject={approveReject}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
