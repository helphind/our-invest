"use client";

import { Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SessionProvider>
            <div className="flex h-screen">
                <Sidebar />

                <div className="flex-1 flex flex-col">
                    <TopBar />

                    <main className="p-6 overflow-y-auto">{children}</main>
                </div>
                <Toaster position="top-right" />
            </div>
        </SessionProvider>
    );
}
