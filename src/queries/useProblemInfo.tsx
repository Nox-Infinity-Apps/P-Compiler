import { useQuery } from "@tanstack/react-query";
import { axiosAPI } from "@/utils/instants/axios/api";

export default function useProblemInfo(code: string) {
    return useQuery({
        queryFn: async () => {
            const req = await axiosAPI.get<Result<string>>(`/question/${code}`);
            return req.data;
        },
        queryKey: ["INFO", code],
        staleTime: Infinity,
    });
}
