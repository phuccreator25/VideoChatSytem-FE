import axiosInterceptor from "../../config/axiosInterceptor";
import type { ICreateReportAccountPayload, ICreateReportMessagePayload, queryReports } from "../../types/Report.type";

const TicketApis = {
    onCreate: (payload: ICreateReportAccountPayload | ICreateReportMessagePayload) =>
        axiosInterceptor.post('/tickets/create', payload),

    onGetData: ({ query, page, limit }: { query: queryReports, page: number, limit: number }) =>
        axiosInterceptor.get('/tickets/get-data', { params: { ...query, page, limit } }),

    onCancel: (reportId: string) =>
        axiosInterceptor.delete(`/tickets/${reportId}/cancel`)
}

export default TicketApis