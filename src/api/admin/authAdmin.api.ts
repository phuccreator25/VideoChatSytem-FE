import axiosInterceptorAdmin from "../../config/axiosInterceptorAdmin";
import type { typeLogin } from "../../types/auth.type";

const authAdminAPI = {
    onLogin: (data: typeLogin) => axiosInterceptorAdmin.post("/admin/login", data),
    onLogOut: () => axiosInterceptorAdmin.post("/admin/logout", {}),
    onRefreshToken: () => axiosInterceptorAdmin.post("/admin/refresh-token", {}),
    onGetProfileAdmin: () => axiosInterceptorAdmin.get("/admin/profile"),
}

export default authAdminAPI