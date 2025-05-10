import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:5100/api/v1",
    withCredentials: true,
});