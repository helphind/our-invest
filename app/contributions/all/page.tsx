import { log } from "console";
import { getAllContributions } from "@/app/services/contribution.service";
import ContributionList from "@/app/components/contributions/ContributionList";

export default async function AllContributionPage() {
    const contributions = await getAllContributions();

    log("Contributions in ContributionPage:", contributions);

    return <ContributionList title="All Contributions" contributions={contributions} />;
}
