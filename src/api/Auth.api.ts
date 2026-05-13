import axiosInterceptor from "../config/axiosInterceptor";
import type { typeLogin, typeRegister } from "../types/auth.type";

const authApi = {
  onRegister: (data : typeRegister) => axiosInterceptor.post("/auth/register", data),
  onLogin: (data : typeLogin) => axiosInterceptor.post("/auth/login", data),
  onActiveAccount: (token : object) => axiosInterceptor.post("/auth/active-account", token),
  onLogOut: () => axiosInterceptor.post("/auth/logout", {}),
  onForgotPassword: (email: object) => axiosInterceptor.post("/auth/forgot-password", email),
  onResetPassword: (token: string, data : object) => axiosInterceptor.post(`/auth/reset-password/${token}`, data),
  onRefreshToken: () => axiosInterceptor.post(`/auth/refresh-token`, {})
};

export default authApi;