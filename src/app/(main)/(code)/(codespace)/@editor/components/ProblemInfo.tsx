import * as React from "react";
import useProblemTabState from "@/recoil/TabState";
import useProblemInfo from "@/queries/useProblemInfo";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProblemInfo() {
    const [problemState] = useProblemTabState();
    const { data, isLoading } = useProblemInfo(
        problemState.tab[problemState.activeTab].problemId,
    );

    if (isLoading) {
        return <Skeleton className="w-full h-full px-5" />;
    }

    return (
        <div
            className="size-full bg-top-bar p-5 overflow-y-auto text-xs !font-[Arial]"
            dangerouslySetInnerHTML={{
                __html: String(data?.data),
            }}
        ></div>
    );
}
