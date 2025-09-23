import axios from 'axios';

// base url
export const apiUrl = 'http://localhost:4000';

export const backendApi = axios.create({
    baseURL: `http://localhost:4000`,
    withCredentials: true,
});

//admin
const adminAxios = axios.create({
    baseURL: `http://localhost:4000/admin`,
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
