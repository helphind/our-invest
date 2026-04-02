"use client";

import { useEffect, useState } from "react";
import ResponsiveDataView from "@/app/components/ui/ResponsiveDataView";
import LinkBtn from "@/app/components/ui/LinkBtn";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { Role } from "@/app/generated/prisma/enums";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/ui/Loader";
import { Action } from "@/app/interface/DataView.interface";
import AddIcon from "@/app/components/ui/icons/add";

export default function MembersPage() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const { data: session } = useSession();

    const isAdmin = session?.user?.role === Role.ADMIN;

    const getAllMembers = async () => {
        setLoading(true);
        const res = await fetch("/api/members/all", {
            method: "GET",
        });
        const members = await res.json();
        setMembers(members);
        setLoading(false);
        return members;
    };

    useEffect(() => {
        const init = async () => {
            await getAllMembers();
        };
        init();
    }, []);

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
                const data = await response.json();
                throw new Error(data.message || "Failed to delete member");
            }

            toast.success("Member deleted successfully");

            getAllMembers();
        } catch (error: any) {
            if (typeof error === "string") {
                toast.error(error);
            } else if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Failed to delete member");
            }
        }
    };

    const columns = [
        { key: "name", label: "Name" },
        { key: "phone", label: "Phone" },
        { key: "email", label: "Email" },
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
    ];

    const actions: Action<any>[] = [
        {
            label: "View",
            type: "link" as const,
            href: (row: any) => `/members/${row.id}`,
            variant: "primary",
        },
        {
            label: "Edit",
            type: "link" as const,
            href: (row: any) => `/members/edit/${row.id}`,
            variant: "secondary",
        },
        {
            label: "Delete",
            type: "button" as const,
            onClick: (row: any) => handleDelete(row.id),
            variant: "danger",
        },
    ];

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                {/* Left Section */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                        Members
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage and view all members
                    </p>
                </div>

                {/* Right Section */}
                {isAdmin && (
                    <div className="w-full sm:w-auto">
                        <LinkBtn
                            href="/members/add"
                            className="
                w-full sm:w-auto
                inline-flex items-center justify-center gap-2
                px-4 py-2.5
                rounded-xl
                bg-blue-600 text-white text-sm font-medium
                shadow-sm
                hover:bg-blue-700 hover:shadow-md
                active:scale-[0.98]
                transition-all duration-200
            "
                        >
                            <AddIcon /> Add Member
                        </LinkBtn>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                {loading && <Loader />}
                <ResponsiveDataView
                    columns={columns}
                    data={members}
                    actions={actions}
                    mobileGridClass="grid-cols-1"
                />
            </div>
        </div>
    );
}
