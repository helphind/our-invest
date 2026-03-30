"use client";
import MemberForm from "@/app/components/members/MemberForm";

export default function AddMemberPage() {
    return (
        <div className="max-w-lg mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-6">Add Member</h1>

            <MemberForm member={null} />
        </div>
    );
}
