import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosAPI } from "@/utils/instants/axios/api";

type Payload = {
    username: string;
    password: string;
};

type Response = {
    access_token: string;
};

export default function useLogin() {
    return useMutation({
        mutationFn: async ({ username, password }: Payload) => {
            const data = await axiosAPI.post<Result<Response>>("/auth/login", {
                username,
                password,
            });
            return data.data;
        },
        mutationKey: ["LOGIN"],
    });
}
