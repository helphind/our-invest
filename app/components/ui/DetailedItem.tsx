export default function DetailItem({
    label,
    value,
    highlight = 'primary',
}: {
    label: string;
    value: any;
    highlight?: "primary" | "info" | "success" | "danger";
}) {
    const colorMap: any = {
        primary: "text-gray-900 font-semibold",
        info: "text-blue-600 font-semibold",
        success: "text-green-600 font-bold",
        danger: "text-red-500 font-semibold",
    };

    return (
        <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">{label}</span>
            <span
                className={`text-sm ${colorMap[highlight] || "text-gray-800"}`}
            >
                {value || "-"}
            </span>
        </div>
    );
}
