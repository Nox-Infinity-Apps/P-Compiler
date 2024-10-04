"use client";

import axios from "axios";

const axiosAPI = axios.create({
    baseURL: "http://localhost:8000/api/py",
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
