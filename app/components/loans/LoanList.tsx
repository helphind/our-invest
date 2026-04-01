"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import LinkBtn from "../ui/LinkBtn";
import { currency, formatMonth } from "@/app/services/utility.service";
import { useSession } from "next-auth/react";
import { Role } from "@/app/generated/prisma/enums";
import ResponsiveDataView from "../ui/ResponsiveDataView";
import { StatusStyles } from "@/config/status.style";

export default function LoanList({ loans }: { loans: any[] }) {
    const router = useRouter();
    const { data: session } = useSession();

    const isAdmin = session?.user?.role === Role.ADMIN;

    const handleDelete = async (id: string) => {
        const confirmed = confirm(
            "Are you sure you want to delete this Loan Request?",
        );

        if (!confirmed) return;

        try {
            const response = await fetch(`/api/loans/${id}`, {
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

    const columns = [
        {
            key: "member",
            label: "Name",
            render: (member: any) => member?.name || "N/A",
        },
        {
            key: "principal",
            label: "Principal",
            render: (principal: number) => currency.format(principal),
        },
        {
            key: "interestRate",
            label: "Interest Rate",
        },
        {
            key: "durationMonths",
            label: "Duration (In Months)",
        },
        {
            key: "startDate",
            label: "EMI Start Month",
            render: (startDate: Date) => formatMonth(startDate),
        },
        {
            key: "emiAmount",
            label: "EMI",
            render: (emiAmount: number) => currency.format(emiAmount),
        },
        {
            key: "totalPayable",
            label: "Total Payable",
            render: (totalPayable: number) => currency.format(totalPayable),
        },
        {
            key: "remainingPayable",
            label: "Remaining Payable",
            render: (remainingPayable: number) =>
                currency.format(remainingPayable),
        },
        {
            key: "status",
            label: "Status",
            render: (status: string) => (
                <span
                    className={`min-w-25 inline-flex justify-center py-2 rounded-full text-center text-xs font-medium ${
                        StatusStyles[status] || "bg-green-100 text-green-600"
                    }`}
                >
                    {status}
                </span>
            ),
        },
        {
            key: "id",
            label: "Action",
            render: (id: string, loan: any) => (
                <div className="flex gap-2">
                    <Link
                        href={`/loans/view/${loan.id}`}
                        className="px-4 py-1 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                    >
                        View
                    </Link>

                    {isAdmin && loan.status !== "CLOSED" && (
                        <>
                            <Link
                                href={`/loans/edit/${loan.id}`}
                                className="px-4 py-1 text-sm bg-amber-500 text-white rounded-full hover:bg-amber-600 transition"
                            >
                                Edit
                            </Link>

                            <button
                                onClick={() => handleDelete(loan.id)}
                                className="px-4 py-1 text-sm bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="header flex">
                <h2 className="text-2xl font-bold mb-6">Loans</h2>
                {isAdmin && <LinkBtn href="/loans/create">Create Loan</LinkBtn>}
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <ResponsiveDataView
                    columns={columns}
                    data={loans}
                    mobileGridClass="grid-cols-2"
                />
                {/*
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Principal</th>
                            <th className="p-4 text-left">Interest Rate</th>
                            <th className="p-4 text-left">
                                Duration (In Months)
                            </th>
                            <th className="p-4 text-left">EMI Start Month</th>
                            <th className="p-4 text-left">EMI</th>
                            <th className="p-4 text-left">Total Payable</th>
                            <th className="p-4 text-left">Remaining Payable</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map((loan, i) => (
                            <tr key={i} className="border-t">
                                <td className="p-4">{loan.member.name}</td>
                                <td className="p-4">
                                    {currency.format(loan.principal)}
                                </td>
                                <td className="p-4">{loan.interestRate}</td>
                                <td className="p-4">{loan.durationMonths}</td>
                                <td className="p-4">
                                    {formatMonth(loan.startDate)}
                                </td>
                                <td className="p-4">
                                    {currency.format(loan.emiAmount)}
                                </td>
                                <td className="p-4">
                                    {currency.format(loan.totalPayable)}
                                </td>
                                <td className="p-4">
                                    {currency.format(loan.remainingPayable)}
                                </td>
                                <td className="p-4">{loan.status}</td>
                                <td className="p-4 flex gap-2">
                                    <Link
                                        href={`/loans/view/${loan.id}`}
                                        className="px-4 py-1 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                                    >
                                        View
                                    </Link>
                                    {isAdmin && loan.status !== "CLOSED" && (
                                        <>
                                            <Link
                                                href={`/loans/edit/${loan.id}`}
                                                className="px-4 py-1 text-sm bg-amber-500 text-white rounded-full hover:bg-amber-600 transition"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() =>
                                                    handleDelete(loan.id)
                                                }
                                                className="px-4 py-1 text-sm bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                */}
            </div>
        </div>
    );
}
