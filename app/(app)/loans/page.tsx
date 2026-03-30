import LoanList from "../../components/loans/LoanList";
import { getAllLoans } from "../../services/loan.service";

export const dynamic = "force-dynamic";

export default async function LoansPage() {
    const loans = await getAllLoans();

    return <LoanList loans={loans} />;
}
