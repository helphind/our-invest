"use client";

import Loader from "@/app/components/ui/Loader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AddContributionPage() {
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // Default to current month
    const [amount, setAmount] = useState(5000);
    const [memberId, setMemberId] = useState("");
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const contributionRequest = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/contributions", {
            method: "POST",
            body: JSON.stringify({
                memberId,
                month: month,
                amount: +amount
            }),
        });

        setLoading(false);

        if (res.ok) {
            toast.success("Contribution added successfully");
            router.push("/contributions");
        } else {
            console.error("Contribution request failed");
            toast.error("Failed to create contribution request");
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
            <h2 className="text-2xl font-bold mb-6">Add Contribution</h2>
            {loading && <Loader />}
            <form onSubmit={contributionRequest} className="max-w-md">
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
                        <label className="block mb-2">Month</label>
                        <input
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="w-full border rounded-lg p-2"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2">Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full border rounded-lg p-2"
                        />
                    </div>

                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </form>
        </div>
    );
}
