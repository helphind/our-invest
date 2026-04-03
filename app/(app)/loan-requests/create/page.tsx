"use client";

import LoanApplicationForm from "@/app/components/loans/LoanApplicationForm";
import Loader from "@/app/components/ui/Loader";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
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
        <div className="max-w-2xl mx-auto mt-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link
                    href="/loans"
                    className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                >
                    <ArrowLeft size={16} />
                </Link>

                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                    Loan Application
                </h2>
            </div>

            <LoanApplicationForm loanApplicationId={null} />
        </div>
    );
}
