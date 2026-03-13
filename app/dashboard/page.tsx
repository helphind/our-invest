import StatCard from "../components/StatCard";
import {
    getTotalContributions,
    getTotalPendingContributions,
} from "../services/contribution.service";
import {
    getActiveInstantLoansCount,
    getActiveLoansCount,
} from "../services/loan.service";
import {
    getActiveMembersCount,
    getMembersCount,
} from "../services/member.service";

export default async function DashboardPage() {
    const allMembers = await getMembersCount();
    const activeMembers = await getActiveMembersCount();
    const activeLoans = await getActiveLoansCount();
    const instantLoans = await getActiveInstantLoansCount();

    const totalContributions = await getTotalContributions();
    const totalPendingContributions = await getTotalPendingContributions();
    const totalReturns = await getActiveInstantLoansCount();
    const totalInterest = await getActiveInstantLoansCount();
    const amountOnHold = await getActiveInstantLoansCount();
    const availableAmountForLoans = await getActiveInstantLoansCount();

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Contributions"
                    value={totalContributions}
                    type="payments"
                />
                <StatCard
                    title="Total Pending Contributions"
                    value={totalPendingContributions}
                    type="pending"
                />
                <StatCard
                    title="Total Interest"
                    value={totalInterest}
                    type="payments"
                />
                <StatCard
                    title="Total Return"
                    value={totalReturns}
                    type="loans"
                />
                <StatCard
                    title="Amount OnHold"
                    value={amountOnHold}
                    type="pending"
                />
                <StatCard
                    title="Available Amount for Loans"
                    value={availableAmountForLoans}
                    type="loans"
                />
                <StatCard
                    title="Active Members"
                    value={activeMembers}
                    type="membersActive"
                />
                <StatCard
                    title="Total Members"
                    value={allMembers}
                    type="membersTotal"
                />
                <StatCard
                    title="Active Loans"
                    value={activeLoans}
                    type="loans"
                />
                <StatCard
                    title="Active Instant Loans"
                    value={instantLoans}
                    type="loans"
                />
            </div>
        </div>
    );
}
