import axios from 'axios';

// base url
export const apiUrl = 'https://backend.onivah.com';

export const backendApi = axios.create({
    baseURL: `https://backend.onivah.com`,
    withCredentials: true,
});

//admin
const adminAxios = axios.create({
    baseURL: `https://backend.onivah.com/admin`,
    withCredentials: true,
});

adminAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default adminAxios;
