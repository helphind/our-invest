"use client";

const styles = {
    membersTotal: {
        iconBg: "from-green-500 to-green-600",
        accent: "border-green-500",
        icon: "👥",
    },
    membersActive: {
        iconBg: "from-blue-500 to-blue-600",
        accent: "border-blue-500",
        icon: "👥",
    },
    membersInActive: {
        iconBg: "from-gray-500 to-gray-600",
        accent: "border-gray-500",
        icon: "👥",
    },
    loans: {
        iconBg: "from-green-500 to-green-600",
        accent: "border-green-500",
        icon: "💰",
    },
    payments: {
        iconBg: "from-orange-500 to-orange-600",
        accent: "border-orange-500",
        icon: "💳",
    },
    pending: {
        iconBg: "from-red-500 to-red-600",
        accent: "border-red-500",
        icon: "⏳",
    },
};

export default function StatCard({
    title,
    value,
    type,
}: {
    title: string;
    value: number | string;
    type: keyof typeof styles;
}) {
    const style = styles[type];

    return (
        <div
            className={`bg-white border-l-4 ${style.accent} rounded-xl shadow-sm p-5 hover:shadow-lg transition duration-300`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium">{title}</p>

                    <p className="text-3xl font-bold text-gray-900 mt-1">
                        {value}
                    </p>
                </div>

                <div
                    className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${style.iconBg} text-white text-xl shadow`}
                >
                    {style.icon}
                </div>
            </div>
        </div>
    );
}
