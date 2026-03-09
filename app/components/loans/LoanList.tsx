"use client";

import Link from "next/link";

export default function LoanList({ loans }: { loans: any[] }) {
    return (
        <div>
            <div className="header flex">
                <h2 className="text-2xl font-bold mb-6">Loans</h2>
                <Link
                    href="/loans/request"
                    className="block ml-auto btn bt-primary hover:text-blue-600"
                >
                    Request Loan
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Principal</th>
                            <th className="p-4 text-left">InterestRate</th>
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
                                <td className="p-4">{loan.totalAmount}</td>
                                <td className="p-4">{loan.status}</td>
                                <td className="p-4">
                                    <Link
                                        href={`/loans/${loan.id}`}
                                        className="mx-2 px-4 py-1 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                                    >
                                        View
                                    </Link>

                                    <Link
                                        href={`/loans/edit/${loan.id}`}
                                        className="px-4 py-1 text-sm bg-amber-500 text-white rounded-full hover:bg-amber-600 transition"
                                    >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
