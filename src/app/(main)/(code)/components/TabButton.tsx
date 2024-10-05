import * as React from "react";
import { useId } from "react";
import useProblemTabState from "@/recoil/TabState";
import { cn } from "@/lib/utils";
import { IoCloseOutline } from "react-icons/io5";

type Props = {
    problemName: string;
    code: string;
    courseId: string;
    problemId: string;
    isActive: boolean;
    index: number;
};
export default function TabButton({
    courseId,
    problemName,
    problemId,
    code,
    isActive,
    index,
}: Props) {
    const id = useId();
    const [state, setState] = useProblemTabState();

    return (
        <div
            onClick={() => {
                setState((pre) => ({ ...pre, activeTab: index }));
            }}
            className={cn(
                "bg-gray-800 px-3 h-full flex items-center gap-x-2 overflow-x-scroll relative min-w-[100px]",
                isActive && "bg-black",
            )}
            key={id}
        >
            {isActive && (
                <>
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-400" />
                    <div className="absolute top-0 left-0 bottom-0 h-full w-[0.5px] bg-gray-500" />
                    <div className="absolute top-0 right-0 bottom-0 h-full w-[0.5px] bg-gray-500" />
                </>
            )}
            <p className="whitespace-break-spaces">{problemName}</p>
            <IoCloseOutline
                onClick={() => {
                    setState((pre) => {
                        const tabs = structuredClone(pre.tab);
                        tabs.splice(index, 1);
                        return { ...pre, tab: [...tabs], activeTab: index - 1 };
                    });
                }}
                className="text-md"
            />
        </div>
    );
}
