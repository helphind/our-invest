"use client";

import ContributionList from "@/app/components/contributions/ContributionList";
import Loader from "@/app/components/ui/Loader";
import { useEffect, useState } from "react";

export default function AllContributionPage() {
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleRefresh = async () => {
        setLoading(true);
        const res = await fetch("/api/contributions/all", {
            method: "GET",
        });

        const allContributions = await res.json();

        console.log("allContributions", allContributions);

        setContributions(allContributions.data);
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
                    listType="ALL"
                    title="All Contributions"
                    contributions={contributions}
                    onRefresh={handleRefresh}
                />
            )}
        </div>
    );
}
