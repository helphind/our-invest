"use client";

import MemberFormSkeleton from "@/app/components/members/MeberFormSkeleton";
import MemberForm from "@/app/components/members/MemberForm";
import { useParams } from "next/navigation";
import { Suspense } from "react";

export default function MemberEditPage() {
    const params = useParams();

    const memberId: string = String(params.id);

    return (
        <div className="max-w-xl mx-auto mt-12 bg-white shadow-md rounded-xl border p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Update Member
            </h2>

            <Suspense fallback={<MemberFormSkeleton />}>
                <MemberForm memberId={memberId} />
            </Suspense>
        </div>
    );
}
