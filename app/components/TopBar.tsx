import { getServerSession } from "next-auth";
import LogoutButton from "./ui/LogoutButton";
import { authOptions } from "@/lib/auth";

export default async function TopBar() {
    const session = await getServerSession(authOptions);

    return (
        <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
            {session && (
                <>
                    <h1 className="text-xl font-semibold">
                        <div className="text-sm text-gray-600 mr-2">
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
