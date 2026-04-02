"use client";

import ResponsiveDataView from "@/app/components/ui/ResponsiveDataView";
import LinkBtn from "@/app/components/ui/LinkBtn";
import Link from "next/link";
import { StatusStyles } from "@/config/status.style";
import { currency } from "@/app/services/utility.service";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/app/components/ui/Loader";

export default function LoanRequestPage() {
    const [loanRequests, setLoanRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const getLoanRequests = async () => {
        setLoading(true);
        const data = await fetch("/api/loan-request", {
            method: "GET",
        });

        const loanRequestAll = await data.json();

        setLoanRequests(loanRequestAll);
        setLoading(false);
    };

    useEffect(() => {
        const initialize = async () => {
            await getLoanRequests();
        };

        initialize();
    }, []);

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

    const columns = [
        {
            key: "member",
            label: "Name",
            render: (member: any) => member?.name || "N/A",
        },
        {
            key: "amount",
            label: "Amount",
            render: (amount: number) => currency.format(amount),
        },
        {
            key: "loanType",
            label: "Loan Type",
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
            render: (id: string, loanRequest: any) =>
                loanRequest.status === "PENDING" && (
                    <div className="flex gap-2">
                        <Link
                            href={`/loan-requests/${id}`}
                            className="px-4 py-1 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                        >
                            Edit
                        </Link>

                        <button
                            onClick={() => handleDelete(id)}
                            className="px-4 py-1 text-sm bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                        >
                            Delete
                        </button>

                        <Link
                            href={`/loan-requests/approvals/${id}`}
                            className="px-4 py-1 text-sm bg-amber-500 text-white rounded-full hover:bg-amber-600 transition"
                        >
                            Approvals
                        </Link>
                    </div>
                ),
        },
    ];

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                {/* Left Section */}
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                        Loan Requests
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage and track loan requests
                    </p>
                </div>

                {/* Right Section */}
                <LinkBtn
                    href="/loan-requests/create"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 text-white text-sm font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                    <span className="text-lg">＋</span>
                    New Loan Request
                </LinkBtn>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                {loading && <Loader />}
                <ResponsiveDataView data={loanRequests} columns={columns} />
            </div>
        </div>
    );
}
