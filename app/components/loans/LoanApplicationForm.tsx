"use client";

import Loader from "@/app/components/ui/Loader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function LoanApplicationForm({
    loanApplicationId,
}: {
    loanApplicationId: string | null;
}) {
    const [id, setId] = useState<string | null>(loanApplicationId);
    const [amount, setAmount] = useState(500000);
    const [memberId, setMemberId] = useState("");
    const [loanType, setLoanType] = useState("NORMAL");
    const [members, setMembers] = useState([]);

    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const updateLoanApplication = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/loan-request", {
            method: "PUT",
            body: JSON.stringify({
                id,
                memberId,
                amount: +amount,
                loanType,
            }),
        });

        setLoading(false);

        if (res.ok) {
            toast.success("Loan application updated successfully");
            router.push("/loan-requests");
        } else {
            console.error("Loan application failed");
            toast.error("Failed to update loan application");
        }
    };

    const createLoanApplication = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/loan-request", {
            method: "POST",
            body: JSON.stringify({
                memberId,
                amount: +amount,
                loanType,
            }),
        });

        setLoading(false);

        if (res.ok) {
            toast.success("Loan application created successfully");
            router.push("/loan-requests");
        } else {
            toast.error("Failed to create loan application");
        }
    };

    useEffect(() => {
        async function loadMembers() {
            const res = await fetch("/api/members");
            const data = await res.json();
            setMembers(data);
        }

        loadMembers();

        const loadLoanApplicationDetails = async () => {
            setLoading(true);
            const res = await fetch(`/api/loan-request/${loanApplicationId}`);
            const data = await res.json();

            console.log("loanApplication", data);

            setId(data.id);
            setAmount(data.amount);
            setMemberId(data.memberId);
            setLoanType(data.loanType);
            setLoading(false);
        };

        if (loanApplicationId) {
            loadLoanApplicationDetails();
        }
    }, [loanApplicationId]);

    return (
        <form
            onSubmit={
                loanApplicationId
                    ? updateLoanApplication
                    : createLoanApplication
            }
            className="max-w-2xl mx-auto mt-8 space-y-6"
        >
            {loading && <Loader />}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6">
                {/* Member */}
                <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">
                        Member
                    </label>
                    <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        value={memberId}
                        onChange={(e) => setMemberId(e.target.value)}
                    >
                        <option value="">Select a member</option>
                        {members.map((member: any) => (
                            <option key={member.id} value={member.id}>
                                {member.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Amount */}
                <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">
                        Loan Amount
                    </label>
                    <input
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                </div>

                {/* Loan Type */}
                <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">
                        Loan Type
                    </label>
                    <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        value={loanType}
                        onChange={(e) => setLoanType(e.target.value)}
                    >
                        <option value="NORMAL">Normal</option>
                        <option value="INSTANT">Instant Loan</option>
                    </select>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                    <Link
                        href="/loans"
                        className="px-5 py-2.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition text-center"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? "Submitting..." : id ? "Update Request" : "Submit Request"}
                    </button>
                </div>
            </div>
        </form>
    );
}
