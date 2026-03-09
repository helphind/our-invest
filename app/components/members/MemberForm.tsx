"use client";

import { Member } from "@/app/interface/Member.type";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MemberForm({
    member,
    onSuccess,
}: {
    member: Member | null;
    onSuccess?: (data: Member) => void;
}) {
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        ...member,
    });

    const router = useRouter();

    const handleChange = (e: any) => {
        const { name, type, value, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/members", {
            method: "POST",
            body: JSON.stringify(form),
        });

        setLoading(false);

        if (res.ok) {
            setForm({ id: "", name: "", email: "", phone: "", isActive: true });

            onSuccess?.(form);
            router.push("/members");
        }
    };

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                    Name
                </label>
                <input
                    type="text"
                    name="name"
                    defaultValue={form?.name}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    defaultValue={member?.email}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Phone */}
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                    Phone
                </label>
                <input
                    name="phone"
                    type="text"
                    defaultValue={member?.phone || ""}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Is Active */}
            <div className="flex items-center gap-3 pt-2">
                <input
                    name="isActive"
                    type="checkbox"
                    defaultChecked={member?.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">
                    Active Member
                </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
                <a
                    href="/members"
                    className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
                >
                    Cancel
                </a>

                <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    {loading
                        ? "Saving..."
                        : form.id
                          ? "Update Member"
                          : "Add Member"}
                </button>
            </div>
        </form>
    );
}

/*
<form onSubmit={handleSubmit} className="space-y-4">
            <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="border p-2 w-full"
                required
            />

            <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="border p-2 w-full"
                required
            />

            <input
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                className="border p-2 w-full"
            />

            <button
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                disabled={loading}
            >
                {loading ? "Saving..." : "Add Member"}
            </button>
        </form>
        */
