"use client";

import Loader from "@/app/components/ui/Loader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditLoanPage({ params }: { id: string }) {
    const [loan, setLoan] = useState(null);
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
            setLoading(false);
        };

        loadLoanDetails();
    }, [params]);

    return (
        <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">Loan Details</h2>
            {loading && <Loader />}

            {loan && (
                <div className="space-y-4">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Member</span>
                        <span className="font-medium">{loan.member.name}</span>
                    </div>

                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Loan Type</span>
                        <span className="font-medium">{loan.loanType}</span>
                    </div>

                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Status</span>
                        <span className="text-green-600">{loan.status}</span>
                    </div>

                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Loan Principal</span>
                        <span className="font-medium">
                            AED {loan.principal}
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
                            AED {loan.emi}
                        </span>
                    </div>

                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Total Interest</span>
                        <span className="text-red-500">
                            AED {loan.totalAmount - loan.principal}
                        </span>
                    </div>

                    <div className="flex justify-between pt-2">
                        <span className="font-semibold text-gray-600">
                            Total Payable
                        </span>
                        <span className="font-bold text-green-600">
                            AED {loan.totalAmount}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
