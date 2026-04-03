import Link from "next/link";

const buttonColor: any = {
    red: "bg-red-600 hover:bg-red-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
    gray: "bg-gray-600 hover:bg-gray-700",
};

export default function LinkBtn({
    href,
    children,
    btnType,
    className = "",
}: {
    href: string;
    children: React.ReactNode;
    btnType?: string;
    className?: string;
}) {
    const btnColor = btnType ? buttonColor[btnType] : buttonColor.blue;

    return (
        <Link
            href={href}
            className={`${btnColor}  ${className} ml-auto inline-flex items-center gap-2 px-4 py-2 
            text-white font-medium rounded-lg 
                        shadow-md hover:shadow-xl 
                        transform hover:-translate-y-0.5 
                        transition-all duration-200`}
        >
            {children}
        </Link>
    );
}
