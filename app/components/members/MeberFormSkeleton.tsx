export default function MemberFormSkeleton() {
    return (
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 sm:p-8 space-y-6 animate-pulse">
            {/* Title */}
            <div className="h-6 w-40 bg-gray-200 rounded"></div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div className="space-y-2">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
                </div>

                {/* Phone */}
                <div className="space-y-2 sm:col-span-2">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
                </div>
            </div>

            {/* Checkbox Section */}
            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
                <div className="space-y-2">
                    <div className="h-4 w-28 bg-gray-200 rounded"></div>
                    <div className="h-3 w-40 bg-gray-200 rounded"></div>
                </div>
                <div className="h-5 w-5 bg-gray-200 rounded"></div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <div className="h-10 w-full sm:w-24 bg-gray-200 rounded-lg"></div>
                <div className="h-10 w-full sm:w-32 bg-gray-200 rounded-lg"></div>
            </div>
        </div>
    );
}
