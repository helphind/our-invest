"use client";

import Loader from "@/app/components/ui/Loader";
import { currency, formatMonth } from "@/app/services/utility.service";
import { useEffect, useState } from "react";

export default function ViewLoanPage({ params }: { id: string }) {
    const [loan, setLoan] = useState(null);
    const [emiSchedule, setEmiSchedule] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const calculateEmiSchedule = (data: any) => {
            const { principal, interestRate, durationMonths, startDate } = data;
            const monthlyInterestRate = interestRate / 12 / 100;
            const emiValue =
                (principal *
                    monthlyInterestRate *
                    Math.pow(1 + monthlyInterestRate, durationMonths)) /
                (Math.pow(1 + monthlyInterestRate, durationMonths) - 1);
            let balance = principal;

            const rows = [];

            for (let i = 1; i <= durationMonths; i++) {
                const interestAmount = balance * monthlyInterestRate;
                const principal = emiValue - interestAmount;

                balance -= principal;

                rows.push({
                    month: i,
                    emi: emiValue.toFixed(2),
                    principal: principal.toFixed(2),
                    interest: interestAmount.toFixed(2),
                    balance: balance > 0 ? balance.toFixed(2) : 0,
                    startDate: startDate,
                });
            }

            setEmiSchedule(rows);
        };

        const loadLoanDetails = async () => {
            const { id } = await params;

            setLoading(true);
            const res = await fetch(`/api/loans/${id}`);
            const data = await res.json();

            console.log("data", data);

            setLoan(data);
            calculateEmiSchedule(data);
            setLoading(false);
        };

        loadLoanDetails();
    }, [params]);

    return (
        <div className="p-6">
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
                            <span className="text-gray-500">
                                Start Date
                            </span>
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
                                    loan.totalAmount - loan.principal,
                                )}
                            </span>
                        </div>

                        <div className="flex justify-between pt-2">
                            <span className="font-semibold text-gray-600">
                                Total Payable
                            </span>
                            <span className="font-bold text-green-600">
                                {currency.format(loan.totalAmount)}
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
                                    <th className="py-2">Month</th>
                                    <th>EMI</th>
                                    <th>Principal</th>
                                    <th>Interest</th>
                                    <th>Balance</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {emiSchedule.map((row) => (
                                    <tr key={row.month} className="border-b">
                                        <td className="py-2">{row.startDate}</td>
                                        <td>{currency.format(row.emi)}</td>
                                        <td>
                                            {currency.format(row.principal)}
                                        </td>
                                        <td>{currency.format(row.interest)}</td>
                                        <td>{currency.format(row.balance)}</td>
                                        <td>
                                            {row.status === 'paid' ? (
                                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                                    Paid
                                                </span>
                                            ) : (
                                                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                                                    Pending
                                                </span>
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
