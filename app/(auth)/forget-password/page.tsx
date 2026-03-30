"use client";

import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // TODO: call your API
        setTimeout(() => {
            setLoading(false);
            setSent(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-[380px] bg-white shadow-xl rounded-2xl">
                <div className="p-6 space-y-5">
                    {/* Heading */}
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold">Forgot Password</h1>
                        <p className="text-sm text-gray-500">
                            Enter your email to receive a reset link
                        </p>
                    </div>

                    {/* Success Message */}
                    {sent ? (
                        <div className="text-center space-y-2">
                            <p className="text-green-600 font-medium">
                                ✅ Reset link sent!
                            </p>
                            <p className="text-sm text-gray-500">
                                Please check your email inbox.
                            </p>
                        </div>
                    ) : (
                        /* Form */
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <Button
                                type="submit"
                                className="w-full rounded-xl"
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Send Reset Link"}
                            </Button>
                        </form>
                    )}

                    {/* Back to Login */}
                    <div className="text-center">
                        <Link href="/login" className="text-sm text-gray-500 hover:text-black">
                            ← Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
