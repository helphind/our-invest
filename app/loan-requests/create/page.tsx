"use client";

import Loader from "@/app/components/ui/Loader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function LoansPage() {
    const [memberId, setMemberId] = useState("");
    const [amount, setAmount] = useState(500000);

    const [loanType, setLoanType] = useState("NORMAL");
    const [loading, setLoading] = useState(false);
    const [members, setMembers] = useState([]);

    const router = useRouter();

    const loanRequest = async (e: any) => {
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
            toast.success("Loan request created successfully");
            router.push("/loan-requests");
        } else {
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
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Loan Request</h2>
            {loading && <Loader />}
            <form onSubmit={loanRequest}>
                <div className="bg-white p-6 rounded-xl shadow max-w-md">
                    <div className="mb-4">
                        <label className="block mb-2">Member ID</label>
                        <select
                            className="w-full border rounded-lg p-2"
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

                    <div className="mb-4">
                        <label className="block mb-2">Loan Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full border rounded-lg p-2"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2">Loan Type</label>
                        <select
                            className="w-full border rounded-lg p-2"
                            value={loanType}
                            onChange={(e) => setLoanType(e.target.value)}
                        >
                            <option value="NORMAL">Normal</option>
                            <option value="INSTANT">Instant Loan</option>
                        </select>
                    </div>

                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit Request"}
                    </button>
                </div>
            </form>
        </div>
    );
}
