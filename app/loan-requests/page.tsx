import LoanRequestList from "../components/loanRequest/LoanRequestList";
import { getAllLoanRequests } from "../services/loan-request.service";

export default async function LoanRequestPage() {
    const loanRequests = await getAllLoanRequests();

    return <LoanRequestList loanRequests={loanRequests} />;
}
