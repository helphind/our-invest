import { AppConfig } from "@/config/app.config";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const appName = AppConfig.appName;

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-4xl mx-auto py-12">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Welcome to the {appName} Application
                </h1>
                <p className="text-gray-600 mb-4">
                    The application to manage your circle fund, allowing you to
                    track members, loans, and payments.
                </p>               
            </div>
        </div>
    );
}
