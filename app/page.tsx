import { AppConfig } from "@/config/app.config";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const appName = AppConfig.appName;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center">
            <div className="max-w-6xl mx-auto px-6 w-full">
                {/* 🔷 Logo */}
                <div className="flex justify-center mb-4 mt-2">
                    <div className="w-full flex justify-center p-4 bg-white rounded-2xl shadow-md">
                        <Image
                            src="/images/logo.png"
                            width={180}
                            height={120}
                            alt={appName}
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* 🔷 Main Card */}
                <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
                    {/* 🔷 Title */}

                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 leading-snug mb-3 sm:mb-4">
                        <span className="block text-gray-600 text-base sm:text-lg font-medium mb-1">
                            Welcome to
                        </span>
                        <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                            {appName}
                        </span>
                    </h1>

                    {/* 🔷 Description */}
                    <p className="text-gray-600 text-base md:text-lg mb-8 max-w-2xl leading-relaxed">
                        Manage your circle fund effortlessly — track members,
                        handle loans, and monitor payments in one powerful
                        dashboard.
                    </p>

                    {/* 🔷 Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-10">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg active:scale-95 transition"
                        >
                            🚀 Go to Dashboard
                        </Link>

                        <Link
                            href="/loans"
                            className="inline-flex items-center justify-center px-6 py-3 rounded-2xl border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-100 hover:shadow-sm transition"
                        >
                            View Loans
                        </Link>
                    </div>

                    {/* 🔷 Divider */}
                    <div className="mb-8 border-t border-gray-100"></div>

                    {/* 🔷 Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {/* Members */}
                        <Link href="/members">
                            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 hover:shadow-md hover:-translate-y-1 transition cursor-pointer">
                                <div className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                                    👥 Members
                                </div>
                                <p className="text-xs text-gray-600 mt-2">
                                    Manage and organize your group members
                                    easily
                                </p>
                            </div>
                        </Link>

                        {/* Loans */}
                        <Link href="/loan-requests">
                            <div className="p-5 rounded-2xl bg-green-50 border border-green-100 hover:shadow-md hover:-translate-y-1 transition cursor-pointer">
                                <div className="text-sm font-semibold text-green-700 flex items-center gap-2">
                                    💰 Loans
                                </div>
                                <p className="text-xs text-gray-600 mt-2">
                                    Track requests, approvals, and repayments
                                </p>
                            </div>
                        </Link>

                        {/* Payments */}
                        <Link href="/contributions">
                            <div className="p-5 rounded-2xl bg-purple-50 border border-purple-100 hover:shadow-md hover:-translate-y-1 transition cursor-pointer">
                                <div className="text-sm font-semibold text-purple-700 flex items-center gap-2">
                                    📊 Payments
                                </div>
                                <p className="text-xs text-gray-600 mt-2">
                                    Monitor contributions and balances in
                                    real-time
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
