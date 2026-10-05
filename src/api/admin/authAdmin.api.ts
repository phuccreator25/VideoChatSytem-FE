import axiosInterceptorAdmin from "../../config/axiosInterceptorAdmin";
import type { typeUpdateAdmin } from "../../types/admin/profileAdmin.type";
import type { typeLogin } from "../../types/auth.type";

const authAdminAPI = {
    onLogin: (data: typeLogin) => axiosInterceptorAdmin.post("/admin/login", data),
    onLogOut: () => axiosInterceptorAdmin.post("/admin/logout", {}),
    onRefreshToken: () => axiosInterceptorAdmin.post("/admin/refresh-token", {}),

    onGetProfileAdmin: () => axiosInterceptorAdmin.get("/admin/profile"),
    onUpdateProfileAdmin: (data: typeUpdateAdmin) => axiosInterceptorAdmin.put("/admin/update-profile", data),
    onUploadPresign: (data: { files: any; type?: string }) => axiosInterceptorAdmin.post("/admin/upload/presign", data),
}

export default authAdminAPI