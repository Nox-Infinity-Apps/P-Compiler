import { useQuery } from "@tanstack/react-query";
import { axiosAPI } from "@/utils/instants/axios/api";

type Response = {
    username: string;
    image: string;
    account: string;
    class_: string;
    email: string;
    date: string;
    gender: string;
    location: string;
    phone: string;
    description: string;
};

export default function useUserInfo() {
    return useQuery({
        queryFn: async () => {
            const data = await axiosAPI.get<Result<Response>>("/user");
            return data.data;
        },
        queryKey: ["USER_INFO"],
        staleTime: Infinity,
    });
}
