import { AppConfig } from "@/config/app.config";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const appName = AppConfig.appName;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center">
            <div className="max-w-5xl mx-auto px-6 w-full">
                {/* Hero Card */}
                <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        Welcome to{" "}
                        <span className="text-blue-600">{appName}</span>
                    </h1>

                    {/* Description */}
                    <p className="text-gray-600 text-base md:text-lg mb-6 max-w-2xl">
                        Manage your circle fund with ease — track members,
                        monitor loans, and stay on top of payments, all in one
                        place.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Go to Dashboard */}
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 hover:shadow-lg transition"
                        >
                            🚀 Go to Dashboard
                        </Link>

                        {/* Optional secondary action */}
                        <Link
                            href="/loans"
                            className="inline-flex items-center justify-center px-6 py-3 rounded-2xl border bg-white text-gray-700 font-medium hover:bg-gray-100 transition"
                        >
                            View Loans
                        </Link>
                    </div>

                    {/* Divider */}
                    <div className="my-8 border-t"></div>

                    {/* Quick Highlights */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                            <div className="text-sm font-semibold text-blue-700">
                                <Link href="/members">👥 Members</Link>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                                Easily manage your group members
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-green-50 border border-green-100">
                            <div className="text-sm font-semibold text-green-700">
                                <Link href="/loan-requests">💰 Loans</Link>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                                Track loan requests and approvals
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100">
                            <p className="text-sm font-semibold text-purple-700">
                                <Link href="/contributions"> 📊 Payments</Link>
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                                Monitor transactions and balances
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
