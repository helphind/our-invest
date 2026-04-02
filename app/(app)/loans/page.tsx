"use client";
import ResponsiveDataView from "@/app/components/ui/ResponsiveDataView";
import LinkBtn from "@/app/components/ui/LinkBtn";
import Link from "next/link";
import { StatusStyles } from "@/config/status.style";
import { currency, formatMonth } from "@/app/services/utility.service";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { Role } from "@/app/generated/prisma/enums";
import { useEffect, useState } from "react";
import Loader from "@/app/components/ui/Loader";

export default function LoansPage() {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(false);

    const { data: session } = useSession();

    const isAdmin = session?.user?.role === Role.ADMIN;

    const getAllLoans = async () => {
        setLoading(true);
        const res = await fetch("/api/loans", {
            method: "GET",
        });
        const members = await res.json();
        setLoans(members);
        setLoading(false);
        return members;
    };

    useEffect(() => {
        const init = async () => {
            await getAllLoans();
        };
        init();
    }, []);

    const handleDelete = async (id: string) => {
        const confirmed = confirm(
            "Are you sure you want to delete this Loan details?",
        );

        if (!confirmed) return;

        try {
            const response = await fetch(`/api/loans/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete loan details");
            }

            toast.success("Loan details deleted successfully");

            getAllLoans();
        } catch (error) {
            console.error("Failed to delete loan details:", error);
            toast.error("Failed to delete loan details");
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
    ];

    const actions: Action<any>[] = [
        {
            label: "View",
            type: "link" as const,
            href: (row: any) => `/loans/view/${row.id}`,
            variant: "primary",
        },
        {
            label: "Edit",
            type: "link" as const,
            href: (row: any) => `/loans/edit/${row.id}`,
            variant: "secondary",
            hidden: (row) => !isAdmin || row.status === "CLOSED",
        },
        {
            label: "Delete",
            type: "button" as const,
            onClick: (row: any) => handleDelete(row.id),
            variant: "danger",
            hidden: (row) => !isAdmin || row.status === "CLOSED",
        },
    ];

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                {/* Left Section */}
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                        Loans
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage and track loans
                    </p>
                </div>

                {/* Right Section */}
                {isAdmin && (
                    <LinkBtn
                        href="/loans/create"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 text-white text-sm font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                        <span className="text-lg">＋</span>
                        New Loan
                    </LinkBtn>
                )}
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                {loading && <Loader />}
                <ResponsiveDataView
                    columns={columns}
                    data={loans}
                    actions={actions}
                    mobileGridClass="grid-cols-2"
                />
            </div>
        </div>
    );
}
