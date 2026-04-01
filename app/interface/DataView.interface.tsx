import { ReactNode } from "react";

export interface Column<T> {
    key: keyof T | string;
    label: string;
    render?: (value: any, row: T) => React.ReactNode;
}

export interface ResponsiveDataViewProps<T> {
    data: T[];
    columns: Column<T>[];
    mobileGridClass?: string; // e.g. "grid-cols-2", "grid-cols-3"
}
