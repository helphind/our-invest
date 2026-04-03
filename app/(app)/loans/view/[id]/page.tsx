"use client";

import DetailItem from "@/app/components/ui/DetailedItem";
import Loader from "@/app/components/ui/Loader";
import ResponsiveDataView from "@/app/components/ui/ResponsiveDataView";
import { Action } from "@/app/interface/DataView.interface";
import {
    currency,
    formatDate,
    formatMonth,
} from "@/app/services/utility.service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ViewLoanPage({ params }: { params: { id: string } }) {
    const [loan, setLoan] = useState<any>(null);
    const [emiSchedule, setEmiSchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const loadLoanDetails = async () => {
            const { id } = await params;

            setLoading(true);
            const res = await fetch(`/api/loans/${id}`);
            const data = await res.json();

            console.log("data", data);

            setLoan(data);
            setEmiSchedule(data.emis);
            setLoading(false);
        };

        loadLoanDetails();
    }, [params]);

    const handleEmi = async (rowData: any) => {
        try {
            console.log("EMI", rowData);
            setLoading(true);
            const response = await fetch(`/api/emi/${rowData.id}`, {
                method: "POST",
                body: JSON.stringify({
                    loanId: rowData.loanId,
                }),
            });
            setLoading(false);
            if (!response.ok) {
                throw new Error("EMI Paid");
            }

            console.log("EMI Paid");
            toast.success("EMI Marked as Paid");

            router.refresh();
        } catch (error) {
            console.error(error);
            setLoading(false);
            toast.error("Failed to mark EMI as Paid");
        }
    };

    const columns = [
        {
            key: "installmentNo",
            label: "Installment No",
            render: (installmentNo: number) => installmentNo,
        },
        {
            key: "dueDate",
            label: "Due Month",
            render: (dueDate: Date) => formatMonth(dueDate),
        },
        {
            key: "amount",
            label: "EMI",
            render: (amount: number) => currency.format(amount),
        },
        {
            key: "principal",
            label: "Principal",
            render: (principal: number) => currency.format(principal),
        },
        {
            key: "interest",
            label: "Interest",
            render: (interest: number) => currency.format(interest),
        },
        {
            key: "paidDate",
            label: "Paid date",
            render: (paidDate: Date) =>
                paidDate ? formatDate(paidDate) : "--",
        },
    ];

    const actions: Action<any>[] = [
        {
            label: "Mark as Paid",
            type: "button" as const,
            onClick: (row: any) => handleEmi(row),
            variant: "primaryGreen",
            hidden: (row) => row.status === "PAID",
        },
    ];

    return (
        <div>
            {loading && <Loader />}
            {!loading && (
                <div className="flex justify-end mb-3">
                    <Link
                        href="/loans"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                    >
                        ← Back to Loans
                    </Link>
                </div>
            )}
            <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl mb-5">
                {loan && (
                    <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
                        {/* Header */}
                        <div className="px-6 py-5 border-b bg-gray-50 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Loan Details
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Overview of loan information
                                </p>
                            </div>

                            {/* Status Badge */}
                            <span
                                className={`px-3 py-1 text-xs font-medium rounded-full ${
                                    loan.status === "ACTIVE"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-600"
                                }`}
                            >
                                {loan.status}
                            </span>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <DetailItem
                                    label="Member"
                                    value={loan.member.name}
                                />
                                <DetailItem
                                    label="Loan Type"
                                    value={loan.loanType}
                                />
                                <DetailItem
                                    label="Tenure"
                                    value={`${loan.durationMonths} months`}
                                />
                                <DetailItem
                                    label="Start Date"
                                    value={formatMonth(loan.startDate)}
                                />
                                <DetailItem
                                    label="Interest Rate"
                                    value={`${loan.interestRate}%`}
                                />
                            </div>

                            {/* Divider */}
                            <div className="border-t"></div>

                            {/* Financial Summary */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <DetailItem
                                    label="Principal"
                                    value={currency.format(loan.principal)}
                                    highlight="primary"
                                />

                                <DetailItem
                                    label="EMI"
                                    value={currency.format(loan.emiAmount)}
                                    highlight="info"
                                />

                                <DetailItem
                                    label="Total Interest"
                                    value={currency.format(
                                        loan.totalPayable - loan.principal,
                                    )}
                                    highlight="danger"
                                />

                                <DetailItem
                                    label="Total Payable"
                                    value={currency.format(loan.totalPayable)}
                                    highlight="success"
                                />
                            </div>

                            {/* Divider */}
                            <div className="border-t"></div>

                            {/* Remaining Section */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <DetailItem
                                    label="Remaining Principal"
                                    value={currency.format(
                                        loan.remainingPrincipal,
                                    )}
                                    highlight="success"
                                />

                                <DetailItem
                                    label="Remaining Payable"
                                    value={currency.format(
                                        loan.remainingPayable,
                                    )}
                                    highlight="success"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {emiSchedule && emiSchedule.length > 0 && (
                <div className="bg-white shadow rounded-xl pt-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Repayment Details
                    </h2>

                    <div className="overflow-auto">
                        <ResponsiveDataView
                            columns={columns}
                            data={emiSchedule}
                            actions={actions}
                            showAvatar={false}
                            showFirstLabel={true}
                            mobileGridClass="grid-cols-2"
                        />
                    </div>
                </div>
            )}

            {!loading && (
                <div className="flex justify-end mt-3">
                    <Link
                        href="/loans"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                    >
                        ← Back to Loans
                    </Link>
                </div>
            )}
        </div>
    );
}
