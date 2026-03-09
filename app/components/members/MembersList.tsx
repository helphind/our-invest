"use client";

import Link from "next/link";

export default function MembersList({ members }: { members: any[] }) {
    return (
        <div>
            <div className="header flex">
                <h2 className="text-2xl font-bold mb-6">Members</h2>
                <Link
                    href="/members/add"
                    className="block ml-auto btn bt-primary hover:text-blue-600"
                >
                    Add
                </Link>
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
                                <td className="p-4">
                                    <Link
                                        href={`/members/${m.id}`}
                                        className="mx-2 px-4 py-1 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                                    >
                                        View
                                    </Link>

                                    <Link
                                        href={`/members/edit/${m.id}`}
                                        className="px-4 py-1 text-sm bg-amber-500 text-white rounded-full hover:bg-amber-600 transition"
                                    >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
