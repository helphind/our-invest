"use client";

export default function StatCardSkeleton() {
    return (
        <div className="p-4 rounded-2xl border bg-gray-50 animate-pulse">
            <div className="flex items-center justify-between">
                <div>
                    <div className="h-3 w-20 bg-gray-300 rounded mb-2"></div>
                    <div className="h-6 w-16 bg-gray-300 rounded"></div>
                </div>

                {/* Optional icon placeholder */}
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            </div>
        </div>
    );
}
