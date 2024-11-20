import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosAPI } from "@/utils/instants/axios/api";
import useCodeState from "@/recoil/CodeState";
import languageCodes from "@/app/(main)/(code)/constants/Languages";

type Variables = {
    problem_id: string;
    lang: number;
    courseId: string;
    code: string;
};

export interface Root {
    code: number;
    solutions: Solution[];
}

export interface Solution {
    id: number;
    user: string;
    username: string;
    problem: string;
    problem_name: string;
    status: number;
    date: string;
    time: string;
    result: string;
    memory: string;
    run_time: string;
    compiler: string;
    color: string;
}

export default function useSubmitCode() {
    const [state] = useCodeState();

    const exten = React.useMemo(() => {
        const key = Object.keys(languageCodes).find((item) => {
            return (
                (languageCodes[item as keyof typeof languageCodes] as any)
                    ?.code == state.lang
            );
        });
        return languageCodes[key as keyof typeof languageCodes]?.ext || "py";
    }, [state.lang]);

    return useMutation({
        mutationFn: async (variables: Variables) => {
            const formData = new FormData();
            const blob = new Blob([variables.code], { type: "text/plain" });
            const file = new File([blob], `code.${exten}`);
            formData.append("file", file);

            return axiosAPI.post<Result<Root>>(
                `/question/submit/${variables.problem_id}?course=${variables.courseId}&lang=${variables.lang}`,
                formData,
            );
        },
    });
}
