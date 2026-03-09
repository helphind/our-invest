import Link from "next/link";

export default function Sidebar() {
    return (
        <div className="w-64 bg-white shadow-lg p-5 hidden md:block">
            <h2 className="text-2xl font-bold mb-8 text-blue-600">
                Friend Circle Fund
            </h2>

            <nav className="space-y-4">
                <Link href="/dashboard" className="block hover:text-blue-600">
                    Dashboard
                </Link>
                <Link href="/members" className="block hover:text-blue-600">
                    Members
                </Link>
                <Link href="/loans" className="block hover:text-blue-600">
                    Loans
                </Link>
            </nav>
        </div>
    );
}
