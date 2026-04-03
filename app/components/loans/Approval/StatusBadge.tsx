export const StatusBadge = ({ status  }) => {
    const map = {
        APPROVED: "bg-green-100 text-green-700",
        REJECTED: "bg-red-100 text-red-700",
        PENDING: "bg-gray-100 text-gray-600",
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${map[status]}`}
        >
            {status}
        </span>
    );
};
