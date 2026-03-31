"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import LinkBtn from "../ui/LinkBtn";
import { Role } from "@/app/generated/prisma/enums";
import { useSession } from "next-auth/react";
import ResponsiveDataView from "../ui/ResponsiveDataView";

export default function MembersList({ members }: { members: any[] }) {
    const router = useRouter();

    const { data: session } = useSession();

    const isAdmin = session?.user?.role === Role.ADMIN;

    const handleDelete = async (id: string) => {
        const confirmed = confirm(
            "Are you sure you want to delete this member?",
        );

        if (!confirmed) return;

        try {
            const response = await fetch(`/api/members/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete member");
            }

            toast.success("Member deleted successfully");

            router.refresh();
        } catch (error) {
            console.error("Failed to delete member:", error);
            toast.error("Failed to delete member");
        }
    };

    const columns = [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        {
            key: "isActive",
            label: "Status",
            render: (active: boolean) => (
                <div className="py-2 md:py-0">
                    <span
                        className={`px-4 py-1 rounded text-xs ${
                            active
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-100 text-gray-600"
                        }`}
                    >
                        {active ? "Active" : "Inactive"}
                    </span>
                </div>
            ),
        },
        {
            key: "id",
            label: "Action",
            render: (id: string) =>
                isAdmin && (
                    <div className="py-2 md:py-0 flex gap-2">
                        <Link
                            href={`/members/${id}`}
                            className="px-4 py-1 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                        >
                            View
                        </Link>

                        <Link
                            href={`/members/edit/${id}`}
                            className="px-4 py-1 text-sm bg-amber-500 text-white rounded-full hover:bg-amber-600 transition"
                        >
                            Edit
                        </Link>

                        <button
                            onClick={() => handleDelete(id)}
                            className="px-4 py-1 text-sm bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                        >
                            Delete
                        </button>
                    </div>
                ),
        },
    ];

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Members
                    </h2>
                    <p className="text-sm text-gray-500">
                        Manage and view all members
                    </p>
                </div>
                {isAdmin && (
                    <LinkBtn
                        href="/members/add"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl 
    bg-blue-600 text-white text-sm font-medium 
    hover:bg-blue-700 transition"
                    >
                        ➕ Add Member
                    </LinkBtn>
                )}
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <ResponsiveDataView columns={columns} data={members} />
                {/*}
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Email</th>
                            <th className="p-4 text-left">Phone</th>
                            <th className="p-4 text-left">Status</th>
                            {isAdmin && (
                                <th className="p-4 text-left">Action</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((m, i) => (
                            <tr key={i} className="border-t">
                                <td className="p-4">{m.name}</td>
                                <td className="p-4">{m.email}</td>
                                <td className="p-4">{m.phone}</td>
                                <td className="p-4">
                                    {m.isActive ? "Active" : "Inactive"}
                                </td>
                                {isAdmin && (
                                    <td className="p-4 flex gap-2">
                                        <Link
                                            href={`/members/${m.id}`}
                                            className="px-4 py-1 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                                        >
                                            View
                                        </Link>

                                        <Link
                                            href={`/members/edit/${m.id}`}
                                            className="px-4 py-1 text-sm bg-amber-500 text-white rounded-full hover:bg-amber-600 transition"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(m.id)}
                                            className="px-4 py-1 text-sm bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
*/}
            </div>
        </div>
    );
}
