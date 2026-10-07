import { useCallback, useEffect, useMemo, useState } from "react"
import type { CallItem, typeQueryCallAdmin } from "../../types/admin/callAdmin.type"
import { useSearchParams } from "react-router-dom";
import callAdminAPI from "../../api/admin/callAdmin.api";
import { enqueueSnackbar } from "notistack";

type Pagination = {
    total: number;
    totalPages: number;
}

export function useCallAdmin() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [calls, setCalls] = useState<CallItem[]>([])
    const [selectedCallForDetail, setSelectedCallForDetail] = useState<CallItem | null>(null);

    const { query, page, limit } = useMemo(() => {
        return {
            query: {
                search: searchParams.get("search") || null,
                type: searchParams.get("type") || "all",
                status: searchParams.get("status") || "all",
                endReason: searchParams.get("endReason") || "all",
                startDate: searchParams.get("startDate") || "",
                endDate: searchParams.get("endDate") || "",
            } as typeQueryCallAdmin,
            page: Number(searchParams.get("page")) || 1,
            limit: Number(searchParams.get("limit")) || 10,
        };
    }, [searchParams]);

    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        totalPages: 0,
    });

    const [loading, setLoading] = useState<boolean>(false);

    const onFetchData = useCallback(async () => {
        try {
            setLoading(true);

            const res = await callAdminAPI.onGetData({ query, page, limit });

            const result = res.data?.data;

            setCalls(result.calls || []);

            setPagination({
                total: result.pagination.total,
                totalPages: result.pagination.totalPages,
            });
        } catch (error) {
            console.error("ERROR FETCH CALLS:", error);
            enqueueSnackbar("Failed to fetch calls", {
                variant: "error",
            });
        } finally {
            setLoading(false);
        }
    }, [query, page, limit]);

    useEffect(() => {
        onFetchData();
    }, [onFetchData]);

    const activeCallsCount = useMemo(() => {
        return calls.filter((call: CallItem) => call.status === "active").length;
    }, [calls]);

    return {
        ui: {
            loading,
            page,
            limit,
            query,
            selectedCallForDetail
        },
        data: {
            calls,
            pagination,
            activeCallsCount
        },
        handler: {
            onFetchData,
            setSelectedCallForDetail
        }
    }
}