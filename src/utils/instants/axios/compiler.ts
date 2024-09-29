import axios from "axios";

const axiosCompiler = axios.create({
    baseURL: "https://judge0-ce.p.rapidapi.com",
    headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "x-rapidapi-key": "18b2cb6010msh827b46f021b4120p1a1558jsn9911a2afb839",
    },
});

export { axiosCompiler };
