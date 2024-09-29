import axios from "axios";

const axiosCompiler = axios.create({
    baseURL: "https://judge0-ce.p.rapidapi.com",
    headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "x-rapidapi-key": "1c63013b55msh7ac7499ed2e71d9p13bde0jsn5ef67917f500",
    },
});

export { axiosCompiler };
