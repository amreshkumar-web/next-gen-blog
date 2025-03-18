import axios from "axios";

let navigateFunction = null; // Store the navigate function

export const setNavigate = (navigate) => {
    navigateFunction = navigate;
};

const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true, // ✅ Ensures cookies (authToken & refreshToken) are sent automatically
});

// ✅ Handle token expiration and refresh logic
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // ✅ Hit refresh token API (Cookies will automatically be sent)
                await axios.post("http://localhost:5000/user/tokenRefresh", {}, { withCredentials: true });

                // ✅ Retry the original request (Cookies already updated with new access token)
                return api(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed", refreshError);

                // ✅ Clear cookies & redirect to login
                document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
/*                 document.cookie = "imageOptimizer=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
 */                
                navigateFunction("/login");
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
