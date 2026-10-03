import axiosInterceptorAdmin from "../../config/axiosInterceptorAdmin"
import type { typeDataCreateUser, typeDataUpdateUser, typeQueryUser } from "../../types/admin/userAdmin.type"


const userAdminAPI = {
    onGetDataUser: ({ query, page, limit }: { query: typeQueryUser, page: number, limit: number }) =>
        axiosInterceptorAdmin.get(`/admin/get-data-user`, {
            params: {
                ...query,
                page,
                limit
            }
        }),

    onCreateAdmin: ({ newAdmin }: { newAdmin: typeDataCreateUser }) =>
        axiosInterceptorAdmin.post(`/admin/create-admin`, newAdmin),

    onUpdateAdmin: ({ updatedAdmin }: { updatedAdmin: typeDataUpdateUser }) =>
        axiosInterceptorAdmin.put(`/admin/update-admin/${updatedAdmin._id}`, updatedAdmin),

    onBanAdmin: ({ _id, banReason }: { _id: string, banReason: string }) =>
        axiosInterceptorAdmin.put(`/admin/ban-user/${_id}`, { banReason }),

    onUnbanAdmin: (_id: string) =>
        axiosInterceptorAdmin.put(`/admin/unban-user/${_id}`),

    onSendMailVerify: (_id: string) =>
        axiosInterceptorAdmin.post(`/admin/send-mail-verify/${_id}`, {})

}

export default userAdminAPI