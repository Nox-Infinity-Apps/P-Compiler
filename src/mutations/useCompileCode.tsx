import { useMutation } from "@tanstack/react-query";
import { axiosAPI } from "@/utils/instants/axios/api";

export interface ResultData {
    std_out: string[];
    std_err: any[];
    time: string[];
    result: boolean[];
    description: string[];
}

type Variables = {
    source_code: string;
    inputs: string[];
    outputs: string[];
};

export default function useCompileCode(langId: string) {
    return useMutation({
        mutationFn: async ({ source_code, inputs, outputs }: Variables) => {
            const data = await axiosAPI.post<Result<ResultData>>(
                `/compile/${langId}`,
                {
                    source_code,
                    inputs,
                    outputs,
                },
            );
            return data.data;
        },
    });
}
