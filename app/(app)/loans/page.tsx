"use client";
import ResponsiveDataView from "@/app/components/ui/ResponsiveDataView";
import LinkBtn from "@/app/components/ui/LinkBtn";
import Link from "next/link";
import { StatusStyles } from "@/config/status.style";
import { currency, formatMonth } from "@/app/services/utility.service";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { Role } from "@/app/generated/prisma/enums";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/app/components/ui/Loader";

export default function LoansPage() {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
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
                    mobileGridClass="grid-cols-2"
                />
            </div>
        </div>
    );
}
