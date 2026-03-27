"use client";

import { useEffect, useState } from "react";
import ContributionList from "../../components/contributions/ContributionList";
import Loader from "../../components/ui/Loader";

export default function ContributionPage() {
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleRefresh = async () => {
        setLoading(true);
        const res = await fetch("/api/contributions/monthly", {
            method: "GET",
        });

        const monthlyContributions = await res.json();

        setContributions(monthlyContributions.data);
        setLoading(false);
    };

    useEffect(() => {
        const init = async () => {
            await handleRefresh();
        };

        init();
    }, []);

    return (
        <div>
            {loading && <Loader />}

            {!loading && (
                <ContributionList
                    listType="MONTH"
                    title="Contribution (Current Month)"
                    contributions={contributions}
                    onRefresh={handleRefresh}
                />
            )}
        </div>
    );
}
