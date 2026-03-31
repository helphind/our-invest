import StatCard from "../../components/StatCard";
import {
    getAmountsOnHold,
    getAvailableAmountForLoan,
    getTotalContributions,
    getTotalInterests,
    getTotalPendingContributions,
    getTotalReturns,
} from "../../services/contribution.service";
import {
    getActiveInstantLoansCount,
    getActiveLoansCount,
    getClosedInstantLoansCount,
    getClosedLoansCount,
    getHoldInstantLoansCount,
    getHoldLoansCount,
} from "../../services/loan.service";
import {
    getActiveMembersCount,
    getMembersCount,
} from "../../services/member.service";
import { currency } from "../../services/utility.service";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const totalContributions = await getTotalContributions();
    const totalPendingContributions = await getTotalPendingContributions();
    // const totalSkippedContributions = await getTotalSkippedContributions();

    const amountOnHold = await getAmountsOnHold();
    const totalInterest = await getTotalInterests();
    const totalReturns = await getTotalReturns();
    const availableAmountForLoans = await getAvailableAmountForLoan();

    const activeLoans = await getActiveLoansCount();
    const closedLoans = await getClosedLoansCount();
    const holdLoans = await getHoldLoansCount();

    const instantLoans = await getActiveInstantLoansCount();
    const closedInstantLoans = await getClosedInstantLoansCount();
    const holdInstantLoans = await getHoldInstantLoansCount();

    const allMembers = await getMembersCount();
    const activeMembers = await getActiveMembersCount();

    return (
        <div className="pb-6">
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Contributions"
                    value={
                        totalContributions
                            ? currency.format(Number(totalContributions))
                            : "-"
                    }
                    styleType="contribution"
                    styleSection="paid"
                />

                <StatCard
                    title="Total Pending Contributions"
                    value={
                        totalPendingContributions
                            ? currency.format(Number(totalPendingContributions))
                            : "-"
                    }
                    styleType="contribution"
                    styleSection="pending"
                />

                {/* 
                <StatCard
                    title="Total Waived / Skipped Contributions"
                    value={totalSkippedContributions ? currency.format(Number(totalSkippedContributions)) : '-'}
                    styleType="contribution"
                    styleSection="skipped"
                /> 
                */}

                <StatCard
                    title="Amount OnHold"
                    value={currency.format(amountOnHold)}
                    styleType="payments"
                    styleSection="pending"
                />

                <StatCard
                    title="Total Interest"
                    value={
                        totalInterest
                            ? currency.format(Number(totalInterest))
                            : "-"
                    }
                    styleType="payments"
                    styleSection="interest"
                />

                <StatCard
                    title="Total Return"
                    value={currency.format(totalReturns)}
                    styleType="payments"
                    styleSection="returned"
                />

                <StatCard
                    title="Available Amount for Loans"
                    value={currency.format(availableAmountForLoans)}
                    styleType="payments"
                    styleSection="available"
                />

                <StatCard
                    title="Active Loans"
                    value={activeLoans}
                    styleType="loanCount"
                    styleSection="active"
                />

                <StatCard
                    title="Closed Loans"
                    value={closedLoans}
                    styleType="loanCount"
                    styleSection="closed"
                />

                <StatCard
                    title="Loans on Hold"
                    value={holdLoans}
                    styleType="loanCount"
                    styleSection="hold"
                />

                <StatCard
                    title="Active Instant Loans"
                    value={instantLoans}
                    styleType="loanCount"
                    styleSection="active"
                />

                <StatCard
                    title="Closed Instant Loans"
                    value={closedInstantLoans}
                    styleType="loanCount"
                    styleSection="closed"
                />

                <StatCard
                    title="Instant Loans on Hold"
                    value={holdInstantLoans}
                    styleType="loanCount"
                    styleSection="hold"
                />

                <StatCard
                    title="Active Members"
                    value={activeMembers}
                    styleType="members"
                    styleSection="active"
                />
                <StatCard
                    title="InActive Members"
                    value={allMembers - activeMembers}
                    styleType="members"
                    styleSection="inactive"
                />
                <StatCard
                    title="Total Members"
                    value={allMembers}
                    styleType="members"
                    styleSection="total"
                />
            </div>
        </div>
    );
}
