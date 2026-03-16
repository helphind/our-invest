"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import LinkBtn from "../ui/LinkBtn";

export default function MembersList({ members }: { members: any[] }) {

    const router = useRouter();

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

    return (
        <div>
            <div className="header flex">
                <h2 className="text-2xl font-bold mb-6">Members</h2>             
                <LinkBtn href="/members/add">Add</LinkBtn>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Email</th>
                            <th className="p-4 text-left">Phone</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Action</th>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
