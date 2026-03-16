import Link from "next/link";

export default function LinkBtn({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 
                        bg-blue-600 text-white font-medium rounded-lg 
                        shadow-md hover:shadow-xl 
                        hover:bg-blue-700 
                        transform hover:-translate-y-0.5 
                        transition-all duration-200"
        >
            {children}
        </Link>
    );
}
