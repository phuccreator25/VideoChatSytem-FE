import { enqueueSnackbar } from "notistack";
import TicketApis from "../../../api/client/Ticket.api";
import type { ICreateReportAccountPayload, ICreateReportMessagePayload, IReportTicket, ReportAccountReason, ReportMessageReason, ReportStatus, ReportTargetType, TicketPagination } from "../../../types/Report.type";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function useTicket() {
    const [tickets, setTickets] = useState<IReportTicket[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [pagination, setPagination] = useState<TicketPagination>()
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const { query, page, limit } = useMemo(() => {
        return {
            query: {
                search: searchParams.get("search") || "",
                targetType: (searchParams.get("targetType") || "all") as ReportTargetType,
                status: (searchParams.get("status") || "all") as ReportStatus,
                reason: (searchParams.get("reason") || "all") as ReportMessageReason | ReportAccountReason,
            },
            page: Number(searchParams.get("page")) || 1,
            limit: Number(searchParams.get("limit")) || 10,
        };
    }, [searchParams]);

    const [searchQuery, setSearchQuery] = useState<string>(query.search || '');

    const onCreateTicket = async (payload: ICreateReportAccountPayload | ICreateReportMessagePayload) => {
        try {
            if (!payload) return

            const res = await TicketApis.onCreate(payload);

            if (res.status === 201) {
                enqueueSnackbar("Ticket created successfully", {
                    variant: "success"
                })
                return true
            }

            return false
        } catch (error) {
            console.error(error)
            return false
        }
    }

    const onGetData = useCallback(async () => {
        try {
            setLoading(true)
            setIsDrawerOpen(false);

            const res = await TicketApis.onGetData({ query, page, limit })

            if (res.status === 200) {
                setTickets(res.data.data.tickets)
                setPagination(res.data.data.pagination)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }, [query, page, limit])

    const onCancel = async (id: string) => {
        try {
            if (!id) return;
            setLoading(true)
            const res = await TicketApis.onCancel(id)

            if (res.status === 200) {
                enqueueSnackbar("Ticket cancelled successfully", {
                    variant: "success"
                })
                onGetData()
                return true
            }
            return false
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        onGetData()
    }, [onGetData])

    return {
        ui: {
            loading,
            isDrawerOpen
        },
        data: {
            tickets,
            pagination,
            query,
            selectedReportId,
            searchParams,
            searchQuery
        },
        handler: {
            onCreateTicket,
            onGetData,
            setSelectedReportId,
            setIsDrawerOpen,
            onCancel,
            setSearchQuery,
            setSearchParams
        }
    }
}   