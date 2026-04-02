"use client";

import { ResponsiveDataViewProps } from "@/app/interface/DataView.interface";
import { StatusStyles } from "@/config/status.style";
import LinkBtn from "./LinkBtn";
import { getActionStyle } from "@/app/services/utility.service";
import Link from "next/link";

export default function ResponsiveDataView<T extends Record<string, any>>({
    data = [],
    columns = [],
    actions = [],
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

            <div className="md:hidden space-y-4">
                {data.map((row, i) => (
                    <div
                        key={i}
                        className="bg-white
    rounded-2xl
    border border-gray-300/70
    shadow-sm hover:shadow-md
    transition-all duration-200
    p-4 space-y-4"
                    >
                        {/* 🔹 Header */}
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                                {/* Avatar / Initial */}
                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                                    {String(row[columns[0].key] || "")
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 leading-tight">
                                        {columns[0]?.render
                                            ? columns[0].render(
                                                  row[columns[0].key],
                                                  row,
                                              )
                                            : row[columns[0].key]}
                                    </h3>

                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {columns[1]?.label}:{" "}
                                        {columns[1]?.render
                                            ? columns[1].render(
                                                  row[columns[1].key],
                                                  row,
                                              )
                                            : row[columns[1].key]}
                                    </p>
                                </div>
                            </div>

                            {/* Status badge */}
                            {row.status && (
                                <span
                                    className={`
                            text-xs font-medium px-2.5 py-1 rounded-full
                            whitespace-nowrap
                            ${StatusStyles[row.status] || "bg-gray-100 text-gray-600"}
                        `}
                                >
                                    {row.status}
                                </span>
                            )}
                        </div>

                        {/* 🔹 Divider */}
                        <div className="border-t border-gray-100" />

                        {/* 🔹 Details */}
                        <div
                            className={`grid ${mobileGridClass || "grid-cols-2"} gap-4`}
                        >
                            {columns.slice(2).map((col) => (
                                <div
                                    key={String(col.key)}
                                    className="space-y-1"
                                >
                                    <div className="text-[11px] uppercase tracking-wide text-gray-400">
                                        {col.label}
                                    </div>
                                    <div className="text-sm font-medium text-gray-900 break-words">
                                        {col.render
                                            ? col.render(row[col.key], row)
                                            : row[col.key]}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 🔹 Footer Actions */}
                        {actions?.length > 0 && (
                            <div className="flex gap-2 pt-2">
                                {actions.map((action, idx) => {
                                    if (action.hidden?.(row)) return null;

                                    const baseClass = `
                flex-1 text-sm py-2 rounded-lg font-medium text-center
                transition flex items-center justify-center gap-1
                ${getActionStyle(action.variant)}
            `;

                                    // 🔗 Link action
                                    if (action.type === "link") {
                                        const href =
                                            typeof action.href === "function"
                                                ? action.href(row)
                                                : action.href;

                                        if (!href) return null; // ✅ prevent undefined

                                        return (
                                            <Link
                                                key={idx}
                                                href={href}
                                                className={baseClass}
                                            >
                                                {action.icon}
                                                {action.label}
                                            </Link>
                                        );
                                    }

                                    // 🔘 Button action
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() =>
                                                action.onClick?.(row)
                                            }
                                            disabled={action.disabled?.(row)}
                                            className={`${baseClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {action.icon}
                                            {action.label}
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
