import * as React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { axiosAPI } from "@/utils/instants/axios/api";
import { AxiosError } from "axios";
import useProblemTabState from "@/recoil/TabState";

export default function useSubmissionHistory() {
    const [problemState] = useProblemTabState();
    const router = useRouter();
    return useQuery({
        queryFn: async () => {
            try {
                const data = await axiosAPI.get<
                    Result<
                        {
                            id: string;
                            date: string;
                            title: string;
                            status: string;
                            time: string;
                            capacity: number;
                            compiler: string;
                        }[]
                    >
                >(`/history`);
                return data.data;
            } catch (err) {
                const e = err as AxiosError;
                if (e.response?.status != 200) {
                    router.replace("/auth/login");
                }
            }
        },
        queryKey: ["SUBMISSIONS"],
        staleTime: Infinity,
    });
}
