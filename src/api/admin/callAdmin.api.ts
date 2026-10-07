import axiosInterceptorAdmin from "../../config/axiosInterceptorAdmin"
import type { typeQueryCallAdmin } from "../../types/admin/callAdmin.type"


const callAdminAPI = {
    onGetData: ({ query, page, limit }: { query: typeQueryCallAdmin, page: number, limit: number }) =>
        axiosInterceptorAdmin.get(`/admin/calls`, {
            params: {
                ...query,
                page,
                limit
            }
        }),


}

export default callAdminAPI