import LoanList from "../../components/loans/LoanList";
import { getAllLoans } from "../../services/loan.service";

export default async function LoansPage() {
    const loans = await getAllLoans();

    return <LoanList loans={loans} />;
}
