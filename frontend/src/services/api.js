import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/",
    withCredentials: true,
});

api.interceptors.response.use(
    res => res,
    async (err) => {
        const originalConfig = err.config;

        if (err.respnse?.status === 401 && !originalConfig._retry) {
            originalConfig._retry = true;
            try {
                await api.post('user/token/refresh');
                return api(originalConfig);
            } catch (refreshError) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(err);
    }
);

export default api;

