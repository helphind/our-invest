"use client";

import LoanApplicationForm from "@/app/components/loans/LoanApplicationForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EditLoanRequestPage() {
    const params = useParams();
    const loanApplicationId: string = String(params.id);

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
                    Update Loan Application
                </h2>
            </div>

            <LoanApplicationForm loanApplicationId={loanApplicationId} />
        </div>
    );
}
