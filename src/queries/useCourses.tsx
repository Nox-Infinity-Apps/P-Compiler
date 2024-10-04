import { useQuery } from "@tanstack/react-query";
import { axiosAPI } from "@/utils/instants/axios/api";

type Response = {
    value: string;
    name: string;
}[];

export default function useCourses() {
    return useQuery({
        queryFn: async () => {
            const data = await axiosAPI.get<Result<Response>>("/course");
            return data.data;
        },
        queryKey: ["COURSES"],
        staleTime: Infinity,
    });
}
