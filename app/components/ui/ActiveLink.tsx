"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ActiveLink({ href, children }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`block px-3 py-2 rounded-md transition
      ${
          isActive
              ? "bg-blue-100 text-blue-700 font-medium"
              : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
      }`}
        >
            {children}
        </Link>
    );
}
