import axios from "axios";

const api = axios.create({
    baseURL: 'https://backend.onivah.com',
})

export const googleAuth = (code) => api.get(`/auth/google?code=${code}`);
