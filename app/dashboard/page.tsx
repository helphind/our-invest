import StatCard from "../components/StatCard";
import { getActiveInstantLoansCount, getActiveLoansCount } from "../services/loan.service";
import {
    getActiveMembersCount,
    getMembersCount,
} from "../services/member.service";

export default async function DashboardPage() {
    const allMembers = await getMembersCount();
    const activeMembers = await getActiveMembersCount();
    const activeLoans = await getActiveLoansCount();
    const instantLoans = await getActiveInstantLoansCount();

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Invest" value="25,000" />
                <StatCard title="Total Interest" value="25,000" />
                <StatCard title="Total Return" value="50,000" />
                <StatCard title="Amount OnHold" value="50,000" />
                <StatCard title="Active Members" value={activeMembers} />
                <StatCard title="Total Members" value={allMembers} />
                <StatCard title="Active Loans" value={activeLoans} />
                <StatCard title="Active Instant Loans" value={instantLoans} />
            </div>
        </div>
    );
}
