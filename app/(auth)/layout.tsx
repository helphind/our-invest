import { Toaster } from "react-hot-toast";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-screen">
            <div className="flex-1 flex flex-col">
                <main>{children}</main>
            </div>

            <Toaster position="top-right" />
        </div>
    );
}
