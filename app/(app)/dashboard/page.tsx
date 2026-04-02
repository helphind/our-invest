import { Suspense } from "react";
import StatCard from "../../components/StatCard";
import StatCardSkeleton from "@/app/components/StatCardSkeleton";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
    return (
        <div className="pb-6">
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Suspense fallback={<StatCardSkeleton />}>
                    <StatCard
                        title="Total Contributions"
                        requestType="totalContributions"
                        valueType="currency"
                        styleType="contribution"
                        styleSection="paid"
                    />
                </Suspense>

                <Suspense fallback={<StatCardSkeleton />}>
                    <StatCard
                        title="Total Pending Contributions"
                        requestType="totalPendingContributions"
                        valueType="currency"
                        styleType="contribution"
                        styleSection="pending"
                    />
                </Suspense>

                <Suspense fallback={<StatCardSkeleton />}>
                    <StatCard
                        title="Amount OnHold"
                        styleType="payments"
                        requestType="amountOnHold"
                        valueType="currency"
                        styleSection="pending"
                    />
                </Suspense>

                <Suspense fallback={<StatCardSkeleton />}>
                    <StatCard
                        title="Total Interest"
                        requestType="totalInterest"
                        valueType="currency"
                        styleType="payments"
                        styleSection="interest"
                    />
                </Suspense>

                <Suspense fallback={<StatCardSkeleton />}>
                    <StatCard
                        title="Total Return"
                        requestType="totalReturns"
                        valueType="currency"
                        styleType="payments"
                        styleSection="returned"
                    />
                </Suspense>

                <Suspense fallback={<StatCardSkeleton />}>
                    <StatCard
                        title="Available Amount for Loans"
                        requestType="availableAmountForLoans"
                        valueType="currency"
                        styleType="payments"
                        styleSection="available"
                    />
                </Suspense>

                <Suspense fallback={<StatCardSkeleton />}>
                    <StatCard
                        title="Active Loans"
                        requestType="activeLoans"
                        valueType="number"
                        styleType="loanCount"
                        styleSection="active"
                    />
                </Suspense>

                <Suspense fallback={<StatCardSkeleton />}>
                    <StatCard
                        title="Closed Loans"
                        requestType="closedLoans"
                        valueType="number"
                        styleType="loanCount"
                        styleSection="closed"
                    />
                </Suspense>

                <Suspense fallback={<StatCardSkeleton />}>
                    <StatCard
                        title="Loans on Hold"
                        requestType="holdLoans"
                        valueType="number"
                        styleType="loanCount"
                        styleSection="hold"
                    />
                </Suspense>

                <Suspense fallback={<StatCardSkeleton />}>
                    <StatCard
                        title="Active Instant Loans"
                        requestType="instantLoans"
                        valueType="number"
                        styleType="loanCount"
                        styleSection="active"
                    />
                </Suspense>

                <Suspense fallback={<StatCardSkeleton />}>
                    <StatCard
                        title="Closed Instant Loans"
                        requestType="closedInstantLoans"
                        valueType="number"
                        styleType="loanCount"
                        styleSection="closed"
                    />
                </Suspense>

                <Suspense fallback={<StatCardSkeleton />}>
                    <StatCard
                        title="Instant Loans on Hold"
                        requestType="holdInstantLoans"
                        valueType="number"
                        styleType="loanCount"
                        styleSection="hold"
                    />
                </Suspense>

                <Suspense fallback={<StatCardSkeleton />}>
                    <StatCard
                        title="Active Members"
                        requestType="activeMembers"
                        valueType="number"
                        styleType="members"
                        styleSection="active"
                    />
                </Suspense>

                <Suspense fallback={<StatCardSkeleton />}>
                    <StatCard
                        title="InActive Members"
                        requestType="inactiveMembers"
                        valueType="number"
                        styleType="members"
                        styleSection="inactive"
                    />
                </Suspense>

                <Suspense fallback={<StatCardSkeleton />}>
                    <StatCard
                        title="Total Members"
                        requestType="allMembers"
                        valueType="number"
                        styleType="members"
                        styleSection="total"
                    />
                </Suspense>
            </div>
        </div>
    );
}
