"use client";

import LinkBtn from "@/app/components/ui/LinkBtn";
import Loader from "@/app/components/ui/Loader";
import { AppConfig } from "@/config/app.config";
import { loginSchema } from "@/lib/validation/login.schema";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { z } from "zod";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState<any>({});

    const appName = AppConfig.appName;

    const handleLogin = async (e: any) => {
        e.preventDefault();

        setErrors({}); // Clear previous errors

        const result = loginSchema.safeParse({ username, password });

        if (!result.success) {
            setErrors(z.flattenError(result.error).fieldErrors);
            toast.error(result.error.issues[0].message);
            return;
        }

        setLoading(true);

        await signIn("credentials", {
            username,
            password,
            redirect: true,
            callbackUrl: "/dashboard",
            session: {
                strategy: "jwt",
                maxAge: 60 * 60 * 2, // 2 hours
            },
        });

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
            {loading && <Loader />}
            <form
                onSubmit={handleLogin}
                className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6"
            >
                {/* Title */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {appName}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Login to your account
                    </p>
                </div>

                {/* UserName */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">
                        Username
                    </label>
                    <input
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        placeholder="Enter your username"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {errors.username && (
                        <p className="text-red-500 text-xs">
                            {errors.username}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">
                        Password
                    </label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-xs">
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-lg font-medium shadow-sm"
                >
                    Login
                </button>


                <div className="text-center">
                    <Link
                        href="/forget-password"
                        className="text-sm text-gray-500 hover:text-black"
                    >
                        Forget Password
                    </Link>
                </div>
            </form>
        </div>
    );
}
