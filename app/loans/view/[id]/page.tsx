"use client";

import Loader from "@/app/components/ui/Loader";
import {
    currency,
    formatDate,
    formatMonth,
} from "@/app/services/utility.service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ViewLoanPage({ params }: { id: string }) {
    const [loan, setLoan] = useState(null);
    const [emiSchedule, setEmiSchedule] = useState([]);
    const [loading, setLoading] = useState(false);

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

    return (
        <div>
            <div>
                <button className="cursor-pointer font-bold ml-auto pointer">
                    Back
                </button>
            </div>
            <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-6 mb-3">
                <h2 className="text-xl font-semibold mb-6">Loan Details</h2>
                {loading && <Loader />}

                {loan && (
                    <div className="space-y-4">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">Member</span>
                            <span className="font-medium">
                                {loan.member.name}
                            </span>
                        </div>

                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">Loan Type</span>
                            <span className="font-medium">{loan.loanType}</span>
                        </div>

                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">Status</span>
                            <span className="text-green-600">
                                {loan.status}
                            </span>
                        </div>

                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">
                                Loan Principal
                            </span>
                            <span className="font-medium">
                                {currency.format(loan.principal)}
                            </span>
                        </div>

                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">
                                Tenure(In Months)
                            </span>
                            <span className="font-semibold text-blue-600">
                                {loan.durationMonths}
                            </span>
                        </div>

                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">Start Date</span>
                            <span className="font-semibold text-blue-600">
                                {formatMonth(loan.startDate)}
                            </span>
                        </div>

                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">Interest Rate</span>
                            <span className="font-medium">
                                {loan.interestRate}%
                            </span>
                        </div>

                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">EMI</span>
                            <span className="font-semibold text-blue-600">
                                {currency.format(loan.emiAmount)}
                            </span>
                        </div>

                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">
                                Total Interest
                            </span>
                            <span className="text-red-500">
                                {currency.format(
                                    loan.totalPayable - loan.principal,
                                )}
                            </span>
                        </div>

                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold text-gray-600">
                                Total Payable
                            </span>
                            <span className="font-bold text-green-600">
                                {currency.format(loan.totalPayable)}
                            </span>
                        </div>

                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold text-gray-600">
                                Remaining Principal
                            </span>
                            <span className="font-bold text-green-600">
                                {currency.format(loan.remainingPrincipal)}
                            </span>
                        </div>

                        <div className="flex justify-between pb-2">
                            <span className="font-semibold text-gray-600">
                                Remaining Payable
                            </span>
                            <span className="font-bold text-green-600">
                                {currency.format(loan.remainingPayable)}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {emiSchedule && emiSchedule.length > 0 && (
                <div className="bg-white shadow rounded-xl p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Repayment Details
                    </h2>

                    <div className="overflow-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="py-2">S.No</th>
                                    <th>Due Month</th>
                                    <th>EMI</th>
                                    <th>Principal</th>
                                    <th>Interest</th>
                                    <th>Paid Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {emiSchedule.map((row: any) => (
                                    <tr key={row.id} className="border-b">
                                        <td>{row.installmentNo}</td>
                                        <td className="py-2">
                                            {formatMonth(row.dueDate)}
                                        </td>
                                        <td>{currency.format(row.amount)}</td>
                                        <td>
                                            {currency.format(row.principal)}
                                        </td>
                                        <td>{currency.format(row.interest)}</td>
                                        <td>
                                            {row.paidDate
                                                ? formatDate(row.paidDate)
                                                : "--"}
                                        </td>
                                        <td className="text-center">
                                            {row.status === "PAID" ? (
                                                <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                                    Paid
                                                </div>
                                            ) : (
                                                <div
                                                    className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs cursor-pointer"
                                                    onClick={() =>
                                                        handleEmi(row)
                                                    }
                                                >
                                                    Pending
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
