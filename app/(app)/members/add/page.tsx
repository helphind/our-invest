"use client";

import MemberForm from "@/app/components/members/MemberForm";

export default function AddMemberPage() {
    return (
        <div className="max-w-xl mx-auto mt-12 bg-white shadow-md rounded-xl border p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Add Member
            </h2>

            <MemberForm memberId={null} />
        </div>
    );
}
