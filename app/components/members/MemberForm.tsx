"use client";

import { Member } from "@/app/interface/Member.type";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../ui/Loader";

export default function MemberForm({
    memberId,
    onSuccess,
}: {
    memberId: string | null;
    onSuccess?: (data: Member) => void;
}) {
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState<any>(null);

    const router = useRouter();

    const handleChange = (e: any) => {
        const { name, type, value, checked } = e.target;
        setForm((prev: any) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setSubmitting(true);

        const res = await fetch("/api/members", {
            method: "POST",
            body: JSON.stringify(form),
        });

        setSubmitting(false);

        if (res.ok) {
            setForm({ id: "", name: "", email: "", phone: "", isActive: true });

            onSuccess?.(form);
            router.push("/members");
        }
    };

    useEffect(() => {
        const getMemberDetails = async () => {
            setLoading(true);
            const res = await fetch(`/api/members/${memberId}`, {
                method: "GET",
            });
            setLoading(false);

            if (res.ok) {
                const data = await res.json();
                setForm(data);
            } else {
                console.error("Failed to fetch member details");
                setForm(null);
            }
        };

        getMemberDetails();
    }, [memberId]);

    return (
        <div>
            {loading && <Loader />}
            <form
                onSubmit={handleSubmit}
                className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 sm:p-8 space-y-6"
            >
                {/* Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            defaultValue={form?.name}
                            onChange={handleChange}
                            placeholder="Enter full name"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            defaultValue={form?.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                    </div>

                    {/* Phone (full width on mobile, half on desktop) */}
                    <div className="flex flex-col sm:col-span-2">
                        <label className="text-sm font-medium text-gray-600 mb-1">
                            Phone
                        </label>
                        <input
                            name="phone"
                            type="text"
                            defaultValue={form?.phone || ""}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                    </div>
                </div>

                {/* Checkbox */}
                <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
                    <div>
                        <p className="text-sm font-medium text-gray-700">
                            Active Member
                        </p>
                        <p className="text-xs text-gray-500">
                            Enable or disable member access
                        </p>
                    </div>

                    <input
                        name="isActive"
                        type="checkbox"
                        checked={form?.isActive || false}
                        onChange={handleChange}
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                    <Link
                        href="/members"
                        className="px-5 py-2.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition text-center"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {submitting
                            ? "Saving..."
                            : memberId
                              ? "Update Member"
                              : "Add Member"}
                    </button>
                </div>
            </form>
        </div>
    );
}
