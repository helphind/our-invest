import { DashboardStyle } from "@/config/dashboard.style";

export const currency = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
});

export const formatMonth = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
    });
};

export const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
        day: "2-digit",
    });
};

export const monthFieldValue = (date: Date) => {
    return new Date(date).toISOString().slice(0, 7);
};

export const getStyle = (section: string, type: string) => DashboardStyle[section][type];

export const getActionStyle = (variant: string) => {
    switch (variant) {
        case "primary":
            return "bg-blue-600 text-white hover:bg-blue-700";
        case "secondary":
            return "bg-gray-100 text-gray-700 hover:bg-gray-200";
        case "danger":
            return "bg-red-100 text-red-600 hover:bg-red-200";
        default:
            return "bg-gray-100 text-gray-700";
    }
};
