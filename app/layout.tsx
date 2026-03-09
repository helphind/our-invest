import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
    title: "Our Investment",
    description: "Our Investment",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="bg-gray-100">
                <div className="flex h-screen">
                    <Sidebar />

                    <div className="flex-1 flex flex-col">
                        <TopBar />

                        <main className="p-6 overflow-y-auto">{children}</main>
                    </div>
                </div>
                <Toaster position="top-right" />
            </body>
        </html>
    );
}
