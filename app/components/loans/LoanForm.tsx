"use client";

import Loader from "@/app/components/ui/Loader";
import { monthFieldValue } from "@/app/services/utility.service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function LoanForm({ loanId }: { loanId: string | null }) {
    const [id, setId] = useState<string | null>(loanId);
    const [amount, setAmount] = useState(500000);
    const [duration, setDuration] = useState(60);
    const [memberId, setMemberId] = useState("");
    const [loanType, setLoanType] = useState("NORMAL");
    const [emiStartMonth, setEmiStartMonth] = useState(
        new Date().toISOString().slice(0, 7),
    );
    const [status, setStatus] = useState<string>("");
    const [members, setMembers] = useState([]);

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const router = useRouter();

    const updateLoanRequest = async (e: any) => {
        e.preventDefault();
        setSubmitting(true);

        const res = await fetch("/api/loans", {
            method: "PUT",
            body: JSON.stringify({
                id,
                memberId,
                amount: +amount,
                duration: +duration,
                loanType,
                emiStartMonth,
                status,
            }),
        });

        setSubmitting(false);

        if (res.ok) {
            toast.success("Loan request updated successfully");
            router.push("/loans");
        } else {
            console.error("Loan request failed");
            toast.error("Failed to update loan request");
        }
    };

    const createLoanRequest = async (e: any) => {
        e.preventDefault();
        setSubmitting(true);

        const res = await fetch("/api/loans", {
            method: "POST",
            body: JSON.stringify({
                memberId,
                amount: +amount,
                duration: +duration,
                loanType,
                emiStartMonth,
            }),
        });

        setSubmitting(false);

        if (res.ok) {
            toast.success("Loan request created successfully");
            router.push("/loans");
        } else {
            console.error("Loan request failed");
            toast.error("Failed to create loan request");
        }
    };

    useEffect(() => {
        async function loadMembers() {
            const res = await fetch("/api/members");
            const data = await res.json();
            setMembers(data);
        }

        loadMembers();

        const loadLoanDetails = async () => {
            setLoading(true);
            const res = await fetch(`/api/loans/${loanId}`);
            const data = await res.json();

            console.log("data", data);

            const startDate = monthFieldValue(data.startDate);

            setId(data.id);
            setAmount(data.principal);
            setDuration(data.durationMonths);
            setMemberId(data.memberId);
            setLoanType(data.loanType);
            setEmiStartMonth(startDate);
            setStatus(data.status);
            setLoading(false);
        };

        if (loanId) {
            loadLoanDetails();
        }
    }, [loanId]);

    return (
        <form onSubmit={loanId ? updateLoanRequest : createLoanRequest}>
            {loading && <Loader />}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6">
                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Member */}
                    <div className="sm:col-span-2">
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
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">
                            Duration (Months)
                        </label>
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) =>
                                setDuration(Number(e.target.value))
                            }
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

                    {/* EMI Start */}
                    <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">
                            EMI Start Month
                        </label>
                        <input
                            type="month"
                            value={emiStartMonth}
                            onChange={(e) => setEmiStartMonth(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>

                    {/* Status */}
                    <div className="sm:col-span-2">
                        <label className="text-sm font-medium text-gray-600 mb-1 block">
                            Status
                        </label>
                        <select
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="HOLD">Hold</option>
                            <option value="CLOSED">Closed</option>
                        </select>
                    </div>
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
                        {submitting
                            ? "Submitting..."
                            : id
                              ? "Update"
                              : "Submit"}
                    </button>
                </div>
            </div>
        </form>
    );
}
