export interface Column<T> {
    key: keyof T | string;
    label: string;
    render?: (value: any, row: T) => React.ReactNode;
}

export interface ResponsiveDataViewProps<T> {
    data: T[];
    columns: Column<T>[];
    actions?: (row: T) => React.ReactNode;
    mobileGridClass?: string; // e.g. "grid-cols-2", "grid-cols-3"
}
