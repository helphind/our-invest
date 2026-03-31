"use client";

import { ResponsiveDataViewProps } from "@/app/interface/DataView.interface";

export default function ResponsiveDataView<T extends Record<string, any>>({
    data = [],
    columns = [],
}: ResponsiveDataViewProps<T>) {
    return (
        <div className="w-full">
            {/* ================= DESKTOP TABLE ================= */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border rounded-xl overflow-hidden">
                    <thead className="bg-gray-100 text-left text-sm text-gray-600">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={String(col.key)}
                                    className="p-3 font-semibold"
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((row, i) => (
                            <tr
                                key={i}
                                className="border-t hover:bg-gray-50 transition"
                            >
                                {columns.map((col) => (
                                    <td
                                        key={String(col.key)}
                                        className="p-3 text-sm text-gray-800"
                                    >
                                        {col.render
                                            ? col.render(row[col.key], row)
                                            : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ================= MOBILE CARDS ================= */}

            <div className="md:hidden space-y-4">
                {data.map((row, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-2xl shadow-sm border p-4 space-y-3"
                    >
                        {/* 🔹 Header (Primary Info) */}
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-gray-900 text-base">
                                {columns[0]?.render
                                    ? columns[0].render(
                                          row[columns[0].key],
                                          row,
                                      )
                                    : row[columns[0].key]}
                            </h3>

                            {/* Example badge (optional) */}
                            {row.status && (
                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
                                    {row.status}
                                </span>
                            )}
                        </div>

                        {/* 🔹 Content (Grid Layout) */}
                        <div className="grid grid-cols-2 gap-2">
                            {columns.slice(1).map((col) => (
                                <div key={String(col.key)}>
                                    <div className="text-xs text-gray-500">
                                        {col.label}
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {col.render
                                            ? col.render(row[col.key], row)
                                            : row[col.key]}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
