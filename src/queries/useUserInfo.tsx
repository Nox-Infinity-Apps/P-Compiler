import { useQuery } from "@tanstack/react-query";
import { axiosAPI } from "@/utils/instants/axios/api";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

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
    const router = useRouter();
    return useQuery({
        queryFn: async () => {
            try {
                const data = await axiosAPI.get<Result<Response>>("/user");
                return data.data;
            } catch (err) {
                const e = err as AxiosError;
                if (e.response?.status != 200) {
                    router.replace("/auth/login");
                }
            }
        },
        queryKey: ["USER_INFO"],
        staleTime: Infinity,
    });
}
