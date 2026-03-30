"use client";

import Loader from "@/app/components/ui/Loader";
import { monthFieldValue } from "@/app/services/utility.service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function EditLoanPage({ params }: { params: { id: string } }) {
    const [id, setId] = useState("");
    const [amount, setAmount] = useState(500000);
    const [duration, setDuration] = useState(60);
    const [loading, setLoading] = useState(false);
    const [memberId, setMemberId] = useState("");
    const [loanType, setLoanType] = useState("NORMAL");
    const [emiStartMonth, setEmiStartMonth] = useState(
        new Date().toISOString().slice(0, 7),
    );
    const [status, setStatus] = useState<string>("");
    const [members, setMembers] = useState([]);

    const router = useRouter();

    const loanRequest = async (e: any) => {
        e.preventDefault();
        setLoading(true);

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

        setLoading(false);

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
            const { id } = await params;

            setLoading(true);
            const res = await fetch(`/api/loans/${id}`);
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

        loadLoanDetails();
    }, [params]);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Loan Request Details</h2>
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
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full border rounded-lg p-2"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2">
                            Duration (In Months)
                        </label>
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
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

                    <div className="mb-4">
                        <label className="block mb-2">EMI Start Month</label>
                        <input
                            type="month"
                            value={emiStartMonth}
                            onChange={(e) => setEmiStartMonth(e.target.value)}
                            className="w-full border rounded-lg p-2"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2">Status</label>

                        <select
                            className="w-full border rounded-lg p-2"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="HOLD">Hold</option>
                            <option value="CLOSED">Closed</option>
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
