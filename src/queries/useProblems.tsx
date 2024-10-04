import { useQuery } from "@tanstack/react-query";
import { axiosAPI } from "@/utils/instants/axios/api";
import useCodePTITState from "@/recoil/CodePTITState";

type Response = {
    status: number;
    code: string;
    name: string;
    group: string;
    topic: string;
    level: number;
}[];

export default function useProblems() {
    const [state] = useCodePTITState();
    return useQuery({
        queryFn: async () => {
            const data = await axiosAPI.get<Result<Response>>(
                `/question?course=${state.targetCourse}`,
            );
            return data.data;
        },
        queryKey: ["PROBLEMS", state.targetCourse],
        staleTime: Infinity,
    });
}
