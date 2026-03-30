import StatCard from "../../components/StatCard";
import {
    getAvailableAmountForLoan,
    getTotalContributions,
    getTotalInterests,
    getTotalPendingContributions,
    getTotalReturns,
    getTotalSkippedContributions,
} from "../../services/contribution.service";
import {
    getActiveInstantLoansCount,
    getActiveLoansCount,
    getClosedLoansCount,
    getHoldLoansCount,
} from "../../services/loan.service";
import {
    getActiveMembersCount,
    getMembersCount,
} from "../../services/member.service";
import { currency } from "../../services/utility.service";

export default async function DashboardPage() {
    const totalContributions = await getTotalContributions();
    const totalInterest = await getTotalInterests();
    const totalReturns = await getTotalReturns();
    const totalPendingContributions = await getTotalPendingContributions();
    const totalSkippedContributions = await getTotalSkippedContributions();

    const allMembers = await getMembersCount();
    const activeMembers = await getActiveMembersCount();

    const activeLoans = await getActiveLoansCount();
    const closedLoans = await getClosedLoansCount();
    const holdLoans = await getHoldLoansCount();
    const instantLoans = await getActiveInstantLoansCount();

    const amountOnHold = await getActiveInstantLoansCount();
    const availableAmountForLoans = await getAvailableAmountForLoan();

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Contributions"
                    value={totalContributions ? currency.format(Number(totalContributions)): '-'}
                    type="payments"
                />

                <StatCard
                    title="Total Interest"
                    value={totalInterest ? currency.format(Number(totalInterest)): '-'}
                    type="payments"
                />

                <StatCard
                    title="Total Return"
                    value={currency.format(totalReturns)}
                    type="loans"
                />

                <StatCard
                    title="Total Pending Contributions"
                    value={totalPendingContributions ? currency.format(Number(totalPendingContributions)) : '-'}
                    type="pending"
                />

                <StatCard
                    title="Total Waived / Skipped Contributions"
                    value={totalSkippedContributions ? currency.format(Number(totalSkippedContributions)) : '-'}
                    type="pending"
                />

                <StatCard
                    title="Amount OnHold"
                    value={currency.format(amountOnHold)}
                    type="pending"
                />

                <StatCard
                    title="Active Loans"
                    value={activeLoans}
                    type="loans"
                />

                <StatCard
                    title="Closed Loans"
                    value={closedLoans}
                    type="loans"
                />

                <StatCard
                    title="Loans on Hold"
                    value={holdLoans}
                    type="loans"
                />

                <StatCard
                    title="Active Instant Loans"
                    value={instantLoans}
                    type="loans"
                />

                <StatCard
                    title="Available Amount for Loans"
                    value={currency.format(availableAmountForLoans)}
                    type="loans"
                />

                <StatCard
                    title="Active Members"
                    value={activeMembers}
                    type="membersActive"
                />
                <StatCard
                    title="InActive Members"
                    value={allMembers - activeMembers}
                    type="membersInActive"
                />
                <StatCard
                    title="Total Members"
                    value={allMembers}
                    type="membersTotal"
                />
            </div>
        </div>
    );
}
