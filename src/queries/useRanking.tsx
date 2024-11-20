import { useQuery } from "@tanstack/react-query";
import { axiosAPI } from "@/utils/instants/axios/api";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export interface Root {
    status: string;
    message: string;
    data: Daum[];
}

export interface Daum {
    stt: string;
    image: string;
    account: string;
    userFirstName: string;
    userLastName: string;
    course: string;
    class_: string;
    ac: string;
    tried: string;
}

export default function useRanking(course_id: string | number) {
    const router = useRouter();
    return useQuery({
        queryFn: async () => {
            try {
                const data = await axiosAPI.get<Root>(
                    `/user/rank/${course_id || 749}`,
                );
                return data.data;
            } catch (err) {
                const e = err as AxiosError;
                if (e.response?.status != 200) {
                    router.replace("/auth/login");
                }
            }
        },
        queryKey: ["RANK", course_id],
        staleTime: Infinity,
    });
}
