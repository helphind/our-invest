import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-4xl mx-auto py-12">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Welcome to the Circle Fund App
                </h1>
                <p className="text-gray-600 mb-4">
                    This is a simple application to manage your circle fund,
                    allowing you to track members, loans, and repayments.
                </p>
                <p className="text-gray-600">
                    Use the navigation bar to access different sections of the
                    app and start managing your circle fund today!
                </p>
            </div>
        </div>
    );
}
