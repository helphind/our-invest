"use client";

import Loader from "@/app/components/ui/Loader";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MemberPage() {
    const params = useParams();
    const [member, setMember] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const memberId: string = String(params.id);

    useEffect(() => {
        const getMemberDetails = async () => {
            setLoading(true);
            const res = await fetch(`/api/members/${memberId}`, {
                method: "GET",
            });
            setLoading(false);

            if (res.ok) {
                const data = await res.json();
                setMember(data);
            } else {
                console.error("Failed to fetch member details");
                setMember(null);
            }
        };

        getMemberDetails();
    }, [memberId]);

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b bg-gray-50">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
                    Member Details
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    View member information and status
                </p>
            </div>

            {loading && <Loader />}

            {/* Content */}
            <div className="p-6 space-y-5">
                {/* Row */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
                    <span className="text-sm text-gray-500">Name</span>
                    <span className="text-sm font-medium text-gray-800">
                        {member?.name || "-"}
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
                    <span className="text-sm text-gray-500">Email</span>
                    <span className="text-sm font-medium text-gray-800 break-all">
                        {member?.email || "-"}
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
                    <span className="text-sm text-gray-500">Phone</span>
                    <span className="text-sm font-medium text-gray-800">
                        {member?.phone || "-"}
                    </span>
                </div>

                {/* Status */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-4">
                    <span className="text-sm text-gray-500">Status</span>
                    <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium w-fit ${
                            member?.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                        }`}
                    >
                        {member?.isActive ? "Active" : "Inactive"}
                    </span>
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t bg-gray-50 flex flex-col sm:flex-row justify-end gap-3">
                <Link
                    href="/members"
                    className="px-5 py-2.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition text-center"
                >
                    Back
                </Link>

                <Link
                    href={`/members/edit/${member?.id}`}
                    className="px-5 py-2.5 text-sm font-medium bg-amber-500 text-white rounded-lg hover:bg-amber-600 active:scale-[0.98] transition text-center"
                >
                    Edit Member
                </Link>
            </div>
        </div>
    );
}
