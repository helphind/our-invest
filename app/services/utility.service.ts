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
