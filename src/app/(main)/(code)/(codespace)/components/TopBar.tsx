"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import useIsElectron from "@/shared/hooks/useIsElectron";
import CompileButton from "@/app/(main)/(code)/components/CompileButton";
import useProblemTabState from "@/recoil/TabState";
import { useId } from "react";
import TabButton from "@/app/(main)/(code)/components/TabButton";

export default function TopBar({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const isElectron = useIsElectron();
    const [state] = useProblemTabState();
    const id = useId();

    return (
        <div
            {...props}
            className={cn(
                className,
                "flex flex-row h-8 bg-top-bar border-b-[0.5px] border-b-gray-600 mb-1 items-center [&>*]:cursor-pointer",
            )}
        >
            <div className="grow flex flex-row text-xs h-full items-center overflow-x-scroll">
                {state.tab.map(
                    ({ problemName, code, courseId, problemId }, index) => (
                        <TabButton
                            key={index}
                            problemName={problemName}
                            code={code}
                            courseId={courseId}
                            problemId={problemId}
                            isActive={index === state.activeTab}
                            index={index}
                        />
                    ),
                )}
            </div>
            {!isElectron && (
                <div className="pr-4">
                    <CompileButton />
                </div>
            )}
        </div>
    );
}
