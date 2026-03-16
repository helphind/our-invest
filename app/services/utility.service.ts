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

export const monthFieldValue = (date: Date) => {
    return new Date(date).toISOString().slice(0, 7);
};
