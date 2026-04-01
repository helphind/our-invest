"use client";

import { ResponsiveDataViewProps } from "@/app/interface/DataView.interface";
import { StatusStyles } from "@/config/status.style";

export default function ResponsiveDataView<T extends Record<string, any>>({
    data = [],
    columns = [],
    actions,
    mobileGridClass,
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

            <div className="md:hidden space-y-4 px-4">
                {data.map((row, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-2xl shadow-sm border p-4 space-y-3"
                    >
                        {/* 🔹 Header */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-gray-900">
                                    {columns[0]?.render
                                        ? columns[0].render(
                                              row[columns[0].key],
                                              row,
                                          )
                                        : row[columns[0].key]}
                                </h3>

                                <div className="text-xs text-gray-500">
                                    {columns[1]?.label}:{" "}
                                    {columns[1]?.render
                                        ? columns[1].render(
                                              row[columns[1].key],
                                              row,
                                          )
                                        : row[columns[1].key]}
                                </div>
                            </div>

                            {/* Status badge */}
                            {row.status && (
                                <span
                                    className={`text-xs px-2 py-1 rounded-full  ${
                                        StatusStyles[row.status] ||
                                        "bg-green-100 text-green-600"
                                    }`}
                                >
                                    {row.status}
                                </span>
                            )}
                        </div>

                        {/* 🔹 Details */}
                        <div
                            className={`grid ${mobileGridClass || "grid-cols-2"} gap-3`}
                        >
                            {columns.slice(2).map((col) => (
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

                        {/* 🔹 Actions */}
                        {actions?.length && (
                            <div className="flex justify-end gap-2 pt-3 border-t">
                                {actions.map((action, idx) => {
                                    if (action.show && !action.show(row))
                                        return null;

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => action.onClick(row)}
                                            className={`p-2 rounded-lg ${
                                                action.className ||
                                                "bg-gray-100 hover:bg-gray-200"
                                            }`}
                                        >
                                            {action.icon}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
