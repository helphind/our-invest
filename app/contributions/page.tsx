import { log } from "console";
import ContributionList from "../components/contributions/ContributionList";
import { getCurrentMonthContributions } from "../services/contribution.service";

export default async function ContributionPage() {
    const contributions = await getCurrentMonthContributions();

    log("Contributions in ContributionPage:", contributions);

    return (
        <ContributionList
            title="Contribution (Current Month)"
            contributions={contributions}
        />
    );
}
