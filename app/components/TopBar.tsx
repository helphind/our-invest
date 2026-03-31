"use client";

import LogoutButton from "./ui/LogoutButton";
import { useSession } from "next-auth/react";

export default function TopBar() {
    const { data: session } = useSession();

    console.log
    ('session', session)

    return (
        <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
            {session && (
                <>
                    <h1 className="text-xl font-semibold">
                        <div className="text-sm text-gray-600 mr-2 ml-8">
                            Welcome, {session.user?.name}{" "}
                        </div>
                    </h1>

                    <div className="flex">
                        <LogoutButton />
                    </div>
                </>
            )}
        </div>
    );
}
