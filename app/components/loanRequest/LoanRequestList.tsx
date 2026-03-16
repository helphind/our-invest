"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import LinkBtn from "../ui/LinkBtn";
import { currency } from "@/app/services/utility.service";

export default function LoanRequestList({
    loanRequests,
}: {
    loanRequests: any[];
}) {
    const router = useRouter();

    const handleDelete = async (id: string) => {
        const confirmed = confirm(
            "Are you sure you want to delete this Loan Request?",
        );

        if (!confirmed) return;

        try {
            const response = await fetch(`/api/loan-request/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete loan request");
            }

            toast.success("Loan request deleted successfully");

            router.refresh();
        } catch (error) {
            console.error("Failed to delete loan request:", error);
            toast.error("Failed to delete loan request");
        }
    };

    const approveLoanRequest = async (id: string) => {
        const confirmed = confirm(
            "Are you sure you want to approve this Loan Request?",
        );

        if (!confirmed) return;

        try {
            const response = await fetch(`/api/loan-request/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: "APPROVED" }),
            });

            if (!response.ok) {
                throw new Error("Failed to approve loan request");
            }

            toast.success("Loan request approved successfully");

            router.refresh();
        } catch (error) {
            console.error("Failed to approve loan request:", error);
            toast.error("Failed to approve loan request");
        }
    };

    return (
        <div>
            <div className="header flex">
                <h2 className="text-2xl font-bold mb-6">Loans</h2>
                <LinkBtn href="/loan-requests/create">
                    Create Loan Request
                </LinkBtn>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Amount</th>
                            <th className="p-4 text-left">Loan Type</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loanRequests.map((loanRequest, i) => (
                            <tr key={i} className="border-t">
                                <td className="p-4">
                                    {loanRequest.member.name}
                                </td>
                                <td className="p-4">{currency.format(loanRequest.amount)}</td>
                                <td className="p-4">{loanRequest.loanType}</td>
                                <td className="p-4">{loanRequest.status}</td>
                                <td className="p-4 flex gap-2">
                                    {loanRequest.status === "PENDING" && (
                                        <>
                                            <Link
                                                href={`/loan-requests/edit/${loanRequest.id}`}
                                                className="px-4 py-1 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() =>
                                                    handleDelete(loanRequest.id)
                                                }
                                                className="px-4 py-1 text-sm bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                                            >
                                                Delete
                                            </button>                            

                                            <Link
                                                href={`/loan-requests/approvals/${loanRequest.id}`}
                                                className="px-4 py-1 text-sm bg-amber-500 text-white rounded-full hover:bg-amber-600 transition"
                                            >
                                                Approvals
                                            </Link>
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
