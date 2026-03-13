"use client";

import { loginSchema } from "@/lib/validation/login.schema";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { z } from "zod";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState<any>({});

    const handleLogin = async (e: any) => {
        e.preventDefault();

        setErrors({}); // Clear previous errors

        const result = loginSchema.safeParse({ email, password });

        if (!result.success) {
            setErrors(z.flattenError(result.error).fieldErrors);
            toast.error(result.error.issues[0].message);
            return;
        }

        await signIn("credentials", {
            email,
            password,
            redirect: true,
            callbackUrl: "/",
            session: {
                strategy: "jwt",
                maxAge: 60 * 60 * 8, // 8 hours
            },
        });
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <form
                onSubmit={handleLogin}
                className="p-6 border rounded w-80 space-y-4"
            >
                <h1 className="text-xl font-bold">Login</h1>

                <input
                    className="border p-2 w-full"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                )}

                <input
                    type="password"
                    className="border p-2 w-full"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                )}

                <button className="bg-blue-600 text-white p-2 w-full">
                    Login
                </button>
            </form>
        </div>
    );
}
