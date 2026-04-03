"use client";

import LoanForm from "@/app/components/loans/LoanForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoansPage() {
    return (
        <div>
            <div className="max-w-3xl mx-auto mt-2 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-center">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 center">
                        New Loan
                    </h2>

                    <Link
                        href="/loans"
                        className="ml-auto inline-flex gap-2 px-3 py-2 text-sm font-medium bg-gray-100 rounded-full hover:bg-gray-200 transition"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </Link>
                </div>

                <LoanForm loanId={null} />
            </div>
        </div>
    );
}
