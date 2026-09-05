import axios from "axios";

/* =========================================================
   API BASE URL
========================================================= */

const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/+$/, "");
export const apiBaseUrl = rawBaseUrl.endsWith("/api") ? rawBaseUrl : `${rawBaseUrl}/api`;

/* =========================================================
   AXIOS INSTANCE
========================================================= */

const api = axios.create({
    baseURL: apiBaseUrl,

    headers: {
        "Content-Type": "application/json",
    },
});

/* =========================================================
   REQUEST INTERCEPTOR
========================================================= */

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/* =========================================================
   RESPONSE INTERCEPTOR
========================================================= */

api.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {
        if (error.response?.status === 401) {
            console.warn(
                "Authentication expired or invalid."
            );
        }

        return Promise.reject(error);
    }
);

export default api;