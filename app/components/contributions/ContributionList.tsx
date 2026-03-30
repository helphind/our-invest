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

const statusStyles: Record<string, string> = {
    PENDING: "bg-yellow-200 text-yellow-800",
    PAID: "bg-green-200 text-green-800",
    OVERDUE: "bg-red-200 text-red-800",
    SKIPPED: "bg-gray-200 text-gray-700",
};

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
    const [filterMonth, setFilterMonth] = useState(
        new Date().toISOString().slice(0, 7),
    );
    const [filteredContributions, setFilteredContributions] = useState<any[]>([]);
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

    return (
        <div>
            {loader && <Loader />}
            <div className="header flex">
                <h2 className="text-2xl font-bold mb-6">{title}</h2>

                <div className="flex ml-auto mr-5">
                    <div className="flex space-x-2 mb-4">
                        {["ALL", "PAID", "PENDING"].map((f) => (
                            <button
                                key={f}
                                onClick={() => handleStatusFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm ${
                                    filterStatus === f
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100"
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {listType === "ALL" && (
                        <div className="flex ml-4">
                            <input
                                type="month"
                                value={filterMonth}
                                onChange={(e) => {
                                    handleMonthlyFilter(e.target.value);
                                }}
                            />
                        </div>
                    )}
                </div>
                <div className="flex ml-auto gap-3">
                    {isAdmin && (
                        <LinkBtn href="/contributions/generate" btnType="red">
                            Generate
                        </LinkBtn>
                    )}
                    <LinkBtn href="/contributions/all" btnType="green">
                        All
                    </LinkBtn>
                    <LinkBtn href="/contributions/add">Add</LinkBtn>
                </div>
            </div>

            {isAdmin && (
                <div className="flex justify-between mb-4">
                    <button
                        onClick={handleMultiMarkPaid}
                        disabled={loader}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                        {loader ? "Updating..." : "Mark as Paid"}
                    </button>
                </div>
            )}

            <div className="bg-white rounded-xl shadow overflow-hidden">
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
            </div>
        </div>
    );
}
