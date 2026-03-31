"use client";

import { AppConfig } from "@/config/app.config";
import ActiveLink from "./ui/ActiveLink";
import { useState } from "react";
import Link from "next/link";

export default function Sidebar() {
    const [open, setOpen] = useState(false);

    const appName = AppConfig.appName;

    const menu = [
        { name: "Dashboard", href: "/dashboard", icon: "🏠" },
        { name: "Members", href: "/members", icon: "👥" },
        { name: "Contribution", href: "/contributions", icon: "💸" },
        { name: "Loans", href: "/loans", icon: "💰" },
        { name: "Loan Requests", href: "/loan-requests", icon: "📄" },
        { name: "EMI Calculator", href: "/emi-calculator", icon: "🧮" },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Mobile Toggle */}
            <button
                onClick={() => setOpen(true)}
                className="md:hidden fixed top-0 left-0 z-50 p-4 rounded-lg"
            >
                ☰
            </button>

            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-white shadow-lg p-5 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-blue-600">
                        {appName}
                    </h2>

                    {/* Close button (mobile) */}
                    <button
                        onClick={() => setOpen(false)}
                        className="md:hidden text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Menu */}
                <nav className="space-y-2">
                    {menu.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition"
                            onClick={() => setOpen(false)} // close on mobile click
                        >
                            <span>{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </aside>
        </div>

        // <div className="w-64 bg-white shadow-lg p-5 hidden md:block">
        //     <h2 className="text-2xl font-bold mb-8 text-blue-600">
        //         {appName}
        //     </h2>

        //     <nav className="space-y-4">
        //         <ActiveLink href="/dashboard">Dashboard</ActiveLink>
        //         <ActiveLink href="/members">Members</ActiveLink>
        //         <ActiveLink href="/loans">Loans</ActiveLink>
        //         <ActiveLink href="/loan-requests">Loan Requests</ActiveLink>
        //         <ActiveLink href="/contributions">Contributions</ActiveLink>
        //         <ActiveLink href="/emi-calculator">EMI Calculator</ActiveLink>
        //     </nav>
        // </div>
    );
}
