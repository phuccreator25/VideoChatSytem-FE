import axiosInterceptorAdmin from "../../config/axiosInterceptorAdmin";
import type { typeQueryReportAdmin } from "../../types/admin/reportAdmin.type";

const reportAdminAPIs = {
    onGetData: ({ query, page, limit }: { query: typeQueryReportAdmin, page: number, limit: number }) =>
        axiosInterceptorAdmin.get(`/admin/reports`, {
            params: {
                ...query,
                page,
                limit
            }
        }),

    onProgress: (id: string) =>
        axiosInterceptorAdmin.put(`/admin/reports/${id}/progress`, {}),

    onResolve: (id: string, data: { resolutionActions: string[], status: string, feedbackToReporter: string, adminNotes: string, unBannedAt?: string | null }) =>
        axiosInterceptorAdmin.put(`/admin/reports/${id}/resolve`, data),

    onRelease: (id: string) =>
        axiosInterceptorAdmin.put(`/admin/reports/${id}/release`, {})
}

export default reportAdminAPIs