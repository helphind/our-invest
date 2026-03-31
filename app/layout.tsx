import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Circle Fund",
    description: "Circle Fund",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="text-gray-900 bg-white">{children}</body>
        </html>
    );
}
