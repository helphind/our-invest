"use client";

import toast from "react-hot-toast";
import LinkBtn from "../ui/LinkBtn";
import {
    currency,
    formatMonth,
    monthFieldValue,
} from "@/app/services/utility.service";
import { useEffect, useState } from "react";
import Loader from "../ui/Loader";
import { useSession } from "next-auth/react";
import { Role } from "@/app/generated/prisma/enums";
import ResponsiveDataView from "../ui/ResponsiveDataView";
import { Action } from "@/app/interface/DataView.interface";
import AddIcon from "../ui/icons/add";

type Props = {
    contributions: any[];
    title: string;
    listType: "ALL" | "MONTH";
    onRefresh: () => void;
};

export default function ContributionList({
    contributions,
    title,
    listType,
    onRefresh,
}: Props) {
    const [loader, setLoader] = useState(false);
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [filterMonth, setFilterMonth] = useState("");
    const [filteredContributions, setFilteredContributions] = useState<any[]>(
        [],
    );
    const [selected, setSelected] = useState<string[]>([]);

    const { data: session } = useSession();

    const isAdmin = session?.user?.role === Role.ADMIN;

    const toggleSelect = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    };

    const toggleSelectAll = () => {
        if (selected.length === filteredContributions.length) {
            setSelected([]);
        } else {
            setSelected(filteredContributions.map((item: any) => item.id));
        }
    };

    const updateStatus = async (id: string, status: string) => {
        setLoader(true);
        try {
            const response = await fetch(`/api/contributions/${id}/status`, {
                method: "POST",
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                throw new Error(`Failed to mark contribution as ${status}`);
            }

            setLoader(false);
            toast.success(`Contribution marked as ${status}`);
            onRefresh();
        } catch (error) {
            setLoader(false);
            console.error(`Error marking contribution as ${status}:`, error);
            toast.error(`Failed to mark contribution as ${status}`);
        }
    };

    const deleteContribution = async (id: string) => {
        const confirmed = confirm(
            "Are you sure you want to delete this contribution?",
        );

        if (!confirmed) return;

        setLoader(true);
        try {
            const response = await fetch(`/api/contributions/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(`Failed to delete contribution`);
            }

            setLoader(false);
            toast.success(`Contribution deleted successfully`);
            onRefresh();
        } catch (error) {
            setLoader(false);
            console.error(`Error deleting contribution ${id}:`, error);
            toast.error(`Failed to delete contribution`);
        }
    };

    const handleStatusFilter = (status: string) => {
        setFilterStatus(status);

        if (status === "ALL") {
            setFilteredContributions(contributions);
            return contributions;
        }

        const filteredList = contributions.filter((c) => c.status === status);

        setFilteredContributions(filteredList);

        return filteredList;
    };

    const handleMonthlyFilter = (month: string) => {
        setFilterMonth(month);

        if (!month) {
            setFilteredContributions(contributions);
            return;
        }

        const statusFilteredList = handleStatusFilter(filterStatus);

        const filteredList = statusFilteredList.filter((c) => {
            const cMonth = new Date(c.month);
            cMonth.setMonth(cMonth.getMonth() + 1);
            const contributionMonth = monthFieldValue(cMonth);

            return contributionMonth === month;
        });

        setFilteredContributions(filteredList);
    };

    const handleMultiMarkPaid = async () => {
        if (selected.length === 0) {
            toast.error("Select at least one");
            return;
        }

        setLoader(true);

        await fetch("/api/contributions/paid", {
            method: "POST",
            body: JSON.stringify({ ids: selected }),
            headers: { "Content-Type": "application/json" },
        });

        setLoader(false);
        setSelected([]);
        location.reload(); // or refresh state
    };

    useEffect(() => {
        handleStatusFilter("ALL"); // your function
    }, []);

    const columns = [
        {
            key: "member",
            label: "Name",
            render: (member: any) => member?.name || "N/A",
        },
        {
            key: "month",
            label: "Month",
            render: (month: Date) => formatMonth(month),
        },
        {
            key: "amount",
            label: "Amount",
            render: (amount: number) => currency.format(amount),
        },
    ];

    const actions: Action<any>[] = [
        {
            label: "Mark as Paid",
            type: "button" as const,
            onClick: (row: any) => updateStatus(row.id, "PAID"),
            variant: "primaryGreen",
            hidden: (row) => row.status !== "PENDING",
        },
        {
            label: "Skip",
            type: "button" as const,
            onClick: (row: any) => updateStatus(row.id, "SKIPPED"),
            variant: "secondary",
            hidden: (row) => row.status !== "PENDING" || !isAdmin,
        },
        {
            label: "Delete",
            type: "button" as const,
            onClick: (row: any) => deleteContribution(row.id),
            variant: "danger",
            hidden: (row) => row.status !== "PENDING" || !isAdmin,
        },
    ];

    return (
        <div>
            {loader && <Loader />}

            <div className="mb-6 space-y-4">
                {/* 🔹 Header Card */}
                <div
                    className="
        bg-white
        border border-gray-200/70
        rounded-2xl
        p-4 sm:p-5
        shadow-sm
    "
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Title */}
                        <div>
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                                {title}
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                Manage contributions and track payments
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            {isAdmin && (
                                <LinkBtn
                                    href="/contributions/generate"
                                    btnType="red"
                                    className="w-full sm:w-auto"
                                >
                                    Generate
                                </LinkBtn>
                            )}

                            {listType === "MONTH" && (
                                <LinkBtn
                                    href="/contributions/all"
                                    btnType="gray"
                                    className="w-full sm:w-auto"
                                >
                                    Show All
                                </LinkBtn>
                            )}

                            {listType === "ALL" && (
                                <LinkBtn
                                    href="/contributions"
                                    btnType="green"
                                    className="w-full sm:w-auto"
                                >
                                    Show Current Month
                                </LinkBtn>
                            )}

                            <LinkBtn
                                href="/contributions/add"
                                className="w-full sm:w-auto"
                            >
                                <AddIcon /> Add
                            </LinkBtn>
                        </div>
                    </div>
                </div>

                {/* 🔹 Filters Card */}
                <div
                    className="
        bg-white
        border border-gray-200/70
        rounded-2xl
        p-4
        shadow-sm
    "
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Status Filters */}
                        <div className="flex flex-wrap gap-2">
                            {["ALL", "PAID", "PENDING"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => handleStatusFilter(f)}
                                    className={`
                            px-4 py-2 rounded-xl text-sm font-medium
                            transition-all duration-150
                            ${
                                filterStatus === f
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }
                        `}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        {/* Month Filter */}
                        {listType === "ALL" && (
                            <div className="w-full sm:w-auto">
                                <input
                                    type="month"
                                    value={filterMonth}
                                    onChange={(e) =>
                                        handleMonthlyFilter(e.target.value)
                                    }
                                    className="
                            w-full sm:w-auto
                            px-3 py-2 rounded-xl border border-gray-300
                            text-sm bg-white text-gray-900
                            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                            transition
                        "
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/*isAdmin && (
                <div className="flex justify-between mb-4">
                    <button
                        onClick={handleMultiMarkPaid}
                        disabled={loader}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                        {loader ? "Updating..." : "Mark as Paid"}
                    </button>
                </div>
            )*/}

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <ResponsiveDataView
                    columns={columns}
                    data={filteredContributions}
                    actions={actions}
                    mobileGridClass="grid-cols-1"
                />
                {/*
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {isAdmin && (
                                <th>
                                    <input
                                        type="checkbox"
                                        onChange={toggleSelectAll}
                                        checked={
                                            selected.length ===
                                            filteredContributions.length
                                        }
                                    />
                                </th>
                            )}
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Month</th>
                            <th className="p-4 text-left">Amount</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredContributions.map((contribution, i) => (
                            <tr key={i} className="border-t">
                                {isAdmin && (
                                    <td>
                                        {contribution.status === "PENDING" && (
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(
                                                    contribution.id,
                                                )}
                                                onChange={() =>
                                                    toggleSelect(
                                                        contribution.id,
                                                    )
                                                }
                                            />
                                        )}
                                    </td>
                                )}
                                <td className="p-4">
                                    {contribution.member.name}
                                </td>
                                <td className="p-4">
                                    {formatMonth(contribution.month)}
                                </td>
                                <td className="p-4">
                                    {currency.format(contribution.amount)}
                                </td>
                                <td className="p-4">
                                    <div
                                        className={` py-2 rounded-full text-center text-xs font-medium ${
                                            statusStyles[contribution.status] ||
                                            "bg-gray-100 text-gray-600"
                                        }`}
                                    >
                                        {contribution.status}
                                    </div>
                                </td>
                                <td className="p-4 flex gap-2">
                                    {contribution.status === "PENDING" && (
                                        <>
                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        contribution.id,
                                                        "PAID",
                                                    )
                                                }
                                                className="px-4 py-1 text-sm bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                                            >
                                                Mark as Paid
                                            </button>
                                            {isAdmin && (
                                                <button
                                                    onClick={() =>
                                                        updateStatus(
                                                            contribution.id,
                                                            "SKIPPED",
                                                        )
                                                    }
                                                    className="px-4 py-1 text-sm bg-gray-600 text-white rounded-full hover:bg-gray-700 transition"
                                                >
                                                    Skip
                                                </button>
                                            )}
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                */}
            </div>
        </div>
    );
}
