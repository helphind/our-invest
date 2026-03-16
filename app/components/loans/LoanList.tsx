"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import LinkBtn from "../ui/LinkBtn";

export default function LoanList({ loans }: { loans: any[] }) {
    const router = useRouter();

    const handleDelete = async (id: string) => {
        const confirmed = confirm(
            "Are you sure you want to delete this Loan Request?",
        );

        if (!confirmed) return;

        try {
            const response = await fetch(`/api/loans/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete loan request");
            }

            toast.success("Loan request deleted successfully");

            router.refresh();
        } catch (error) {
            console.error("Failed to delete loan request:", error);
            toast.error("Failed to delete loan request");
        }
    };

    return (
        <div>
            <div className="header flex">
                <h2 className="text-2xl font-bold mb-6">Loans</h2>

                <LinkBtn href="/loans/create">Create Loan</LinkBtn>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Principal</th>
                            <th className="p-4 text-left">InterestRate</th>
                            <th className="p-4 text-left">
                                Duration (In Months)
                            </th>
                            <th className="p-4 text-left">TotalAmount</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map((loan, i) => (
                            <tr key={i} className="border-t">
                                <td className="p-4">{loan.member.name}</td>
                                <td className="p-4">{loan.principal}</td>
                                <td className="p-4">{loan.interestRate}</td>
                                <td className="p-4">{loan.durationMonths}</td>
                                <td className="p-4">{loan.totalAmount}</td>
                                <td className="p-4">{loan.status}</td>
                                <td className="p-4 flex gap-2">
                                    <Link
                                        href={`/loans/view/${loan.id}`}
                                        className="px-4 py-1 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                                    >
                                        View
                                    </Link>

                                    <Link
                                        href={`/loans/edit/${loan.id}`}
                                        className="px-4 py-1 text-sm bg-amber-500 text-white rounded-full hover:bg-amber-600 transition"
                                    >
                                        Edit
                                    </Link>

                                    <button
                                        onClick={() => handleDelete(loan.id)}
                                        className="px-4 py-1 text-sm bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
