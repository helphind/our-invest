import { ca } from "zod/v4/locales";
import {
    getAmountsOnHold,
    getAvailableAmountForLoan,
    getTotalContributions,
    getTotalInterests,
    getTotalPendingContributions,
    getTotalReturns,
} from "./contribution.service";
import {
    getActiveInstantLoansCount,
    getActiveLoansCount,
    getClosedInstantLoansCount,
    getClosedLoansCount,
    getHoldInstantLoansCount,
    getHoldLoansCount,
} from "./loan.service";
import { getActiveMembersCount, getMembersCount } from "./member.service";
import { cache } from "react";

export const getDashboardStats = cache(async (statType: string) => {
    switch (statType) {
        case "totalContributions":
            return await getTotalContributions();
        case "totalPendingContributions":
            return await getTotalPendingContributions();
        case "amountOnHold":
            return await getAmountsOnHold();

        case "totalInterest":
            return await getTotalInterests();
        case "totalReturns":
            return await getTotalReturns();
        case "availableAmountForLoans":
            return await getAvailableAmountForLoan();
        case "activeLoans":
            return await getActiveLoansCount();
        case "closedLoans":
            return await getClosedLoansCount();
        case "holdLoans":
            return await getHoldLoansCount();
        case "instantLoans":
            return await getActiveInstantLoansCount();
        case "closedInstantLoans":
            return await getClosedInstantLoansCount();
        case "holdInstantLoans":
            return await getHoldInstantLoansCount();
        case "allMembers":
            return await getMembersCount();
        case "activeMembers":
            return await getActiveMembersCount();
        case "inactiveMembers":
            const allMembers = await getMembersCount();
            const activeMembers = await getActiveMembersCount();
            return allMembers - activeMembers;
        default:
            throw new Error("Invalid stat type");
    }
});
