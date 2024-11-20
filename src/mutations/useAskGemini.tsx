import { useMutation } from "@tanstack/react-query";
import { axiosAPI } from "@/utils/instants/axios/api";

export interface ResultData {
    message: string;
    status: string;
    data: {
        response: string;
    };
}

type Variables = {
    source_code: string;
    chatHistory: {
        role: "user" | "model";
        parts: string[];
    }[];
    msg: string;
};
export default function useAskGemini() {
    return useMutation({
        mutationFn: async (variables: Variables) => {
            return axiosAPI.post<ResultData>("/gemini", {
                ask_msg: variables.msg,
                chat_history: variables.chatHistory,
                code: variables.source_code,
            });
        },
    });
}
