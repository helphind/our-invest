export default function StatCard({
    title,
    value,
}: {
    title: string;
    value: string | number;
}) {
    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
    );
}
