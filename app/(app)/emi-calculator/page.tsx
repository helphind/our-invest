"use client";

import { useState } from "react";
import { currency } from "../../services/utility.service";
import ResponsiveDataView from "@/app/components/ui/ResponsiveDataView";

export default function EmiCalculator() {
    const [amount, setAmount] = useState(500000);
    const [interest, setInterest] = useState(8);
    const [tenure, setTenure] = useState(60);
    const [emi, setEmi] = useState<number | null>(null);
    const [schedule, setSchedule] = useState<any[]>([]);

    const [totalInterest, setTotalInterest] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);

    const calculate = () => {
        const P = Number(amount);
        const r = Number(interest) / 12 / 100;
        const n = Number(tenure);

        const emiValue = Math.round(
            (((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)) * 100) /
                100,
        );

        setEmi(emiValue);

        setTotalPayment(emiValue * tenure);
        setTotalInterest(emiValue * tenure - amount);

        let balance = P;
        const rows = [];

        for (let i = 1; i <= n; i++) {
            const interestAmount = balance * r;
            const principal = emiValue - interestAmount;

            balance -= principal;

            rows.push({
                month: i,
                emi: emiValue,
                principal: Math.round(principal),
                interest: Math.round(interestAmount),
                balance: balance > 0 ? Math.round(balance) : 0,
            });
        }

        setSchedule(rows);
    };

    const columns = [
        {
            key: "month",
            label: "Month",
        },

        {
            key: "principal",
            label: "Principal Paid",
            render: (principal: number) => currency.format(principal),
        },
        {
            key: "interest",
            label: "Interest Paid",
            render: (Interest: number) => currency.format(Interest),
        },
        {
            key: "emi",
            label: "EMI Amount",
            render: (emi: number) => currency.format(emi),
        },
        {
            key: "balance",
            label: "Outstanding Balance",
            render: (balance: number) => currency.format(balance),
        },
    ];

    return (
        <div className=" p-6 space-y-8">
            <h1 className="text-2xl font-bold text-center">EMI Calculator</h1>

            <div className="max-w-xl mx-auto shadow-lg space-y-5 bg-white shadow rounded-xl p-6">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Loan Amount
                    </label>
                    <input
                        type="number"
                        placeholder="Loan Amount"
                        className="border p-2 rounded-lg w-full"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Interest Rate (%)
                    </label>
                    <input
                        type="number"
                        placeholder="Interest %"
                        className="border p-2 rounded-lg w-full"
                        value={interest}
                        onChange={(e) => setInterest(Number(e.target.value))}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Tenure (months)
                    </label>
                    <input
                        type="number"
                        placeholder="Tenure (months)"
                        className="border p-2 rounded-lg w-full"
                        value={tenure}
                        onChange={(e) => setTenure(Number(e.target.value))}
                    />
                </div>

                <div>
                    <button
                        onClick={calculate}
                        className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 w-full"
                    >
                        Calculate EMI
                    </button>
                </div>
            </div>

            {emi && (
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-5 rounded-xl">
                        <p className="text-gray-500 text-sm">Monthly EMI</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {currency.format(emi)}
                        </p>
                    </div>

                    <div className="bg-orange-50 p-5 rounded-xl">
                        <p className="text-gray-500 text-sm">Total Interest</p>
                        <p className="text-2xl font-bold text-orange-600">
                            {currency.format(totalInterest)}
                        </p>
                    </div>

                    <div className="bg-green-50 p-5 rounded-xl">
                        <p className="text-gray-500 text-sm">Total Payment</p>
                        <p className="text-2xl font-bold text-green-600">
                            {currency.format(totalPayment)}
                        </p>
                    </div>
                </div>
            )}

            {/* SCHEDULE */}
            {schedule.length > 0 && (
                <div className="bg-white shadow rounded-xl p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Repayment Schedule
                    </h2>

                    <div className="overflow-auto">
                        <ResponsiveDataView columns={columns} data={schedule} />
                    </div>
                </div>
            )}
        </div>
    );
}
