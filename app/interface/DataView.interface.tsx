export interface Column<T> {
    key: keyof T | string;
    label: string;
    render?: (value: any, row: T) => React.ReactNode;
}

export interface Action<T> {
    label: string;
    type: "button" | "link"; // default = button

    // for button
    onClick?: (row: T) => void;

    // for link
    href?: string | ((row: T) => string);

    variant: "primary" | "secondary" | "danger" | "primaryGreen"; // for styling
    icon?: React.ReactNode;
    className?: string;

    // conditional logic
    hidden?: (row: T) => boolean;
    disabled?: (row: T) => boolean;
}

export interface ResponsiveDataViewProps<T> {
    data: T[];
    columns: Column<T>[];
    actions?: Action<T>[];
    mobileGridClass?: string; // e.g. "grid-cols-2", "grid-cols-3"
}
