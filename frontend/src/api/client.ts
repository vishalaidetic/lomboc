import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8081",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
    authToken = token;
};

// Request interceptor for auth
api.interceptors.request.use((config) => {
    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error("Unauthorized - User session might be expired");
        }
        return Promise.reject(error);
    }
);
