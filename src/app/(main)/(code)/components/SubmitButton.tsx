import * as React from "react";
import { FaPlay } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { compileCode } from "@/app/(main)/(code)/actions/submit-action";
import useCodeState from "@/recoil/CodeState";
import useMainState from "@/recoil/MainState";
import { useEffect } from "react";
import useProblemTabState from "@/recoil/TabState";
import useCompileCode from "@/mutations/useCompileCode";
import useSubmitCode from "@/mutations/useSubmitCode";
import languageCodes from "@/app/(main)/(code)/constants/Languages";
import useSubmissionState from "@/recoil/SubmissionState";

export default function SubmitButton() {
    const queryClient = useQueryClient();
    const [{ source, lang }, setState] = useCodeState();
    const { setTerminalActiveIndex } = useMainState();
    const [problemState] = useProblemTabState();
    const [subState, setSubState] = useSubmissionState();

    const { mutateAsync: submit, isPending } = useSubmitCode();

    const langCode = React.useMemo(() => {
        const key = Object.keys(languageCodes).find((item) => {
            return (
                (languageCodes[item as keyof typeof languageCodes] as any)
                    ?.code == lang
            );
        });
        return languageCodes[key as keyof typeof languageCodes]?.plang || 5;
    }, [lang]);

    const runCode = React.useCallback(() => {
        setSubState((pre) => {
            return {
                ...pre,
                submissions: [
                    ...pre.submissions,
                    {
                        id:
                            problemState.tab[problemState.activeTab]
                                .problemId || "",
                        name: problemState.tab[problemState.activeTab]
                            .problemName,
                        status: "pending" as any,
                        submissionStatus: "Waiting...",
                    },
                ],
            };
        });
        setTerminalActiveIndex(1);
        submit({
            courseId: problemState.tab[problemState.activeTab].courseId || "",
            problem_id:
                problemState.tab[problemState.activeTab].problemId || "",
            code: problemState.tab[problemState.activeTab].code || "",
            lang: langCode,
        }).then((data) => {
            queryClient.refetchQueries({
                queryKey: ["SUBMISSIONS"],
            });
            setState((pre) => ({
                ...pre,
                output: "",
                err: "",
            }));
            setSubState((pre) => {
                const submissions = [...pre.submissions];
                submissions[submissions.length - 1] = {
                    ...submissions[submissions.length - 1],
                    status: "done",
                    submissionStatus: data.data.data.solutions[0].result,
                };
                return {
                    submissions,
                };
            });
            setTerminalActiveIndex(1);
        });
    }, [
        langCode,
        problemState.activeTab,
        problemState.tab,
        queryClient,
        setState,
        setSubState,
        setTerminalActiveIndex,
        submit,
    ]);

    useEffect(() => {
        setState((pre) => ({
            ...pre,
            loading: isPending,
        }));
    }, [isPending, setState]);

    return (
        <button
            onClick={() => {
                runCode();
            }}
            className="flex gap-x-1 text-xs items-center px-2 text-blue-500 hover:text-blue-700 py-1 border hover:border-blue-800 border-blue-700 rounded-md"
        >
            Submit
        </button>
    );
}
