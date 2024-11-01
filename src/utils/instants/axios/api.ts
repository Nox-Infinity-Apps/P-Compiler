"use client";

import axios from "axios";

const axiosAPI = axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL,
});

axiosAPI.interceptors.request.use(
    (request) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("access_token");
            if (token) {
                request.headers.Authorization = `Bearer ${token}`;
            }
        }
        return request;
    },
    (error) => Promise.reject(error),
);

export { axiosAPI };
