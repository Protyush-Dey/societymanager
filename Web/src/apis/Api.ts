import axios, { type InternalAxiosRequestConfig } from "axios";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL??"https://todo-backend-dotnet.onrender.com/api",
  withCredentials: true,
  // timeout: 5000,
});

api.interceptors.request.use(
  (con: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token: string = localStorage.getItem("TO_Access") || "";
    con.headers.Authorization = `Bearer ${token}`;
    return con;
  },
);

// api.interceptors.response.use(
//   (res) => res,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as InternalAxiosRequestConfig & {
//       _retry?: boolean;
//     };
//     if (error.status == 401 && originalRequest && !originalRequest._retry) {
//       originalRequest._retry = true;

//         const res = await RefreshAccessToken();
//         if (res.status) {
//           const token: string = res.result.token;
//           store.dispatch(LoginState(token));
//           return api(originalRequest);
//         } else {
//           await LogoutUser();
//         }
      
//     }
//   },
// );