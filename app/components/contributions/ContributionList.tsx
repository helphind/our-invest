"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import LinkBtn from "../ui/LinkBtn";
import { currency, formatMonth } from "@/app/services/utility.service";
import { useState } from "react";
import Loader from "../ui/Loader";

export default function ContributionList({
    contributions,
    title,
}: {
    contributions: any[];
    title: string;
}) {
    const [loader, setLoader] = useState(false);
    const router = useRouter();

    const markAsPaid = async (id: string) => {
        setLoader(true);
        try {
            const response = await fetch(`/api/contributions/${id}/paid`, {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Failed to mark contribution as paid");
            }

            setLoader(false);
            toast.success("Contribution marked as paid");
            router.refresh();
        } catch (error) {
            setLoader(false);
            console.error("Error marking contribution as paid:", error);
            toast.error("Failed to mark contribution as paid");
        }
    };

    return (
        <div>
            {loader && <Loader />}
            <div className="header flex">
                <h2 className="text-2xl font-bold mb-6">{title}</h2>
                <div className="flex ml-auto gap-3">
                    <LinkBtn href="/contributions/all">All</LinkBtn>
                    <LinkBtn href="/contributions/add">Add</LinkBtn>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Month</th>
                            <th className="p-4 text-left">Amount</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contributions.map((contribution, i) => (
                            <tr key={i} className="border-t">
                                <td className="p-4">
                                    {contribution.member.name}
                                </td>
                                <td className="p-4">
                                    {formatMonth(contribution.month)}
                                </td>
                                <td className="p-4">
                                    {currency.format(contribution.amount)}
                                </td>
                                <td className="p-4">{contribution.status}</td>
                                <td className="p-4 flex gap-2">
                                    {contribution.status !== "PAID" && (
                                        <button
                                            onClick={() =>
                                                markAsPaid(contribution.id)
                                            }
                                            className="px-4 py-1 text-sm bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                                        >
                                            Mark as Paid
                                        </button>
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
