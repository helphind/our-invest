"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
    return (
        <button onClick={() => signOut()} className="text-gray-600">
            Logout
        </button>
    );
}
