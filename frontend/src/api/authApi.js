import axiosClient from "./axiosClient";
import { clearAuth } from "../utils/storage";
export const registerApi = async ({ name, email, password }) => {
    const res = await axiosClient.post("/auth/register", {
        name,
        email,
        password,
    });
    return res.data;
};

export const loginApi = async ({ email, password }) => {
    const res = await axiosClient.post("/auth/login", {
        email,
        password,
    });
    return res.data;
}; 