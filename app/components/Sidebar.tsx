"use client";

import { AppConfig } from "@/config/app.config";
import ActiveLink from "./ui/ActiveLink";

export default function Sidebar() {

    const appName = AppConfig.appName;

    return (
        <div className="w-64 bg-white shadow-lg p-5 hidden md:block">
            <h2 className="text-2xl font-bold mb-8 text-blue-600">
                {appName}
            </h2>

            <nav className="space-y-4">
                <ActiveLink href="/dashboard">Dashboard</ActiveLink>
                <ActiveLink href="/members">Members</ActiveLink>
                <ActiveLink href="/loans">Loans</ActiveLink>
                <ActiveLink href="/loan-requests">Loan Requests</ActiveLink>
                <ActiveLink href="/contributions">Contributions</ActiveLink>
                <ActiveLink href="/emi-calculator">EMI Calculator</ActiveLink>
            </nav>
        </div>
    );
}
