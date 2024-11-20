import * as React from "react";
import useSubmissionState from "@/recoil/SubmissionState";
import Loading from "@/components/app/Loading";
import useCodeState from "@/recoil/CodeState";
import { cn } from "@/lib/utils";

export default function SubmissionStatus() {
    const [submissionState] = useSubmissionState();
    const [state] = useCodeState();

    return (
        <div
            style={{
                fontFamily: "JetBrains Mono, monospace",
            }}
            className="w-full h-full relative text-[0.85rem] overflow-scroll flex flex-col"
        >
            {state.loading && <Loading />}
            {submissionState.submissions.toReversed().map((sub, index) => {
                let color = "text-gray-300";
                switch (sub.submissionStatus) {
                    case "AC":
                        color = "text-green-500";
                        break;

                    case "Waiting...":
                        color = "text-yellow-500";
                        break;

                    default:
                        color = "text-red-500";
                        break;
                }
                return (
                    <pre
                        key={index}
                        className={cn("select-text text-gray-300", color)}
                    >
                        {sub.name} [{sub.id}] - {sub.status} -{" "}
                        {sub.submissionStatus}
                    </pre>
                );
            })}
        </div>
    );
}
