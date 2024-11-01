import { useQuery } from "@tanstack/react-query";
import { axiosAPI } from "@/utils/instants/axios/api";

export default function useProblemInfo(code: string, course_id: string) {
    return useQuery({
        queryFn: async () => {
            const req = await axiosAPI.get<any>(
                `/question/${code}/${course_id}`,
            );
            return req.data;
        },
        queryKey: ["INFO", code],
        staleTime: Infinity,
    });
}
