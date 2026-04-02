
import { getDashboardStats } from "../services/dashboard.service";
import { currency, getStyle } from "../services/utility.service";

export default async function StatCard({
    title,
    requestType,
    valueType,
    styleType,
    styleSection,
}: {
    title: string;
    requestType: string;
    valueType: "currency" | "number";
    styleType: string;
    styleSection: string;
}) {
    const style = getStyle(styleType, styleSection);

    const statValue: any = await getDashboardStats(requestType);
       
    return (
        <div className="relative group">
            {/* Glow border */}
            <div
                className={`absolute inset-0 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300 bg-gradient-to-br ${style.iconBg}`}
            ></div>

            {/* Card */}
            <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-sm group-hover:shadow-xl transition duration-300">
                <div className="flex items-center justify-between">
                    {/* Left Content */}
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-500 tracking-wide uppercase">
                            {title}
                        </p>

                        <p className="text-3xl font-bold text-gray-900">
                            {valueType === "currency" ? currency.format(Number(statValue)) : statValue}
                        </p>
                    </div>

                    {/* Icon */}
                    <div
                        className={`relative flex items-center justify-center w-14 h-14 rounded-2xl text-white text-xl shadow-md 
        bg-gradient-to-br ${style.iconBg} group-hover:scale-110 transition duration-300`}
                    >
                        {style.icon}
                    </div>
                </div>
            </div>
        </div>
    );
}
