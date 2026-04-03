"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function GenerateContribution() {
    const [month, setMonth] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleGenerate = async () => {
        if (!month) {
            toast.error("Please select a month");
            return;
        }

        if (month && !/^\d{4}-\d{2}$/.test(month)) {
            toast.error("Invalid month format. Use YYYY-MM");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/jobs/contributions", {
                method: "POST",
                body: JSON.stringify({ month }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            toast.success(`✅ Created Count: ${data.created}`);
            router.push("/contributions");
        } catch (err) {
            toast.error("❌ Failed to generate");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-2xl space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
                Generate Contributions
            </h2>

            <div className="flex flex-col space-y-2">
                <label className="text-sm text-gray-600">Select Month</label>

                <input
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <button
                onClick={handleGenerate}
                disabled={loading}
                className={`w-full py-2 rounded-lg text-white font-medium transition 
          ${
              loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
          }
        `}
            >
                {loading ? "Generating..." : "Generate Contributions"}
            </button>
        </div>
    );
}
