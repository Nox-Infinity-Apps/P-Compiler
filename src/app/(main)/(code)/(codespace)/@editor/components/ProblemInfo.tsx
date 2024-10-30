import * as React from "react";
import useProblemTabState from "@/recoil/TabState";
import useProblemInfo from "@/queries/useProblemInfo";
import { Skeleton } from "@/components/ui/skeleton";
import "@/app/(main)/(code)/(codespace)/@editor/problem.css";

export default function ProblemInfo() {
    const [problemState] = useProblemTabState();
    const { data, isLoading, isError } = useProblemInfo(
        problemState.tab[problemState.activeTab]?.problemId,
    );

    if (isLoading) {
        return <Skeleton className="w-full h-full px-5" />;
    }

    if (isError) {
        return (
            <div className="size-full bg-top-bar p-5 overflow-y-auto text-xs !font-[Arial] *:text-white">
                <p className="text-sm">{"Failed to get problem's info!"}</p>
            </div>
        );
    }

    return (
        <div
            className="size-full bg-top-bar p-5 overflow-y-auto text-xs !font-[Arial] *:text-white"
            dangerouslySetInnerHTML={{
                __html: String(data?.data),
            }}
        ></div>
    );
}
