import { useState, useMemo, useEffect, useCallback } from "react";
import type { AdminResolutionAction, IAdminReportItem, IAdminReportKpi } from "../../types/admin/reportAdmin.type";
import { useSearchParams } from "react-router-dom";
import reportAdminAPIs from "../../api/admin/reportAdmin.api";
import type { ReportAccountReason, ReportMessageReason, ReportStatus, ReportTargetType, TicketPagination } from "../../types/Report.type";
import { enqueueSnackbar } from "notistack";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

export function useReportAdmin() {
  const [reports, setReports] = useState<IAdminReportItem[]>([]);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<TicketPagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [kpis, setKpis] = useState<IAdminReportKpi>()
  const currentAdminId = useSelector((state: RootState) => state?.admin?.currentAdmin?._id)

  const [selectedReport, setSelectedReport] = useState<IAdminReportItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

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

  const onGetData = useCallback(async () => {
    try {
      setLoading(true);

      const result = await reportAdminAPIs.onGetData({ query, page, limit });

      if (result.status === 200) {
        setReports(result.data.data.reports || []);

        if (result.data.kpi) setKpis(result.data.kpi);
        if (result.data.data.pagination) setPagination(result.data.data.pagination);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [query, page, limit]);

  const onProgress = async (id: string) => {
    try {
      const result = await reportAdminAPIs.onProgress(id);
      if (result.status === 200) {
        onGetData();
        setSelectedReport((prev) => {
          if (prev && prev.id === id) {
            return {
              ...prev,
              status: "in_progress",
              assignedTo: {
                id: currentAdminId ?? "",
                name: "Admin (You)",
                assignedAt: new Date().toISOString(),
              },
            };
          }
          return prev;
        });
      }
      return result;
    } catch (error) {
      console.log('PROGRESS FAIL: ', error);
      throw error;
    }
  };

  const onResolve = async (id: string, data: { resolutionActions: string[], status: string, feedbackToReporter: string, adminNotes: string, unBannedAt?: string | null }) => {
    try {
      if (!id) return;

      if (!data.resolutionActions || data.resolutionActions.length === 0) {
        enqueueSnackbar('Please select at least one resolution action', { variant: 'warning' })
        return;
      }

      const result = await reportAdminAPIs.onResolve(id, data);

      if (result.status === 200) {
        onGetData();
        setSelectedReport((prev) => {
          if (prev && prev.id === id) {
            return {
              ...prev,
              status: data.status as ReportStatus,
              resolutionActions: data.resolutionActions as AdminResolutionAction[],
              feedbackToReporter: data.feedbackToReporter,
              adminNotes: data.adminNotes,
              unBannedAt: data.unBannedAt || null,
              resolvedAt: new Date().toISOString(),
            };
          }
          return prev;
        });
      }

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  const onRelease = async (id: string) => {
    try {
      if (!id) return;

      const result = await reportAdminAPIs.onRelease(id);

      if (result.status === 200) {
        onGetData();
        setSelectedReport((prev) => {
          if (prev && prev.id === id) {
            return {
              ...prev,
              status: "pending",
              assignedTo: { id: "", name: "", assignedAt: "" },
              assignedAt: null,
            };
          }
          return prev;
        });
      }
      return result;
    } catch (error) {
      console.log('RELEASE FAIL: ', error);
    }
  }

  const handleSelectReport = (report: IAdminReportItem) => {
    setSelectedReport(report);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedReport(null);
  };

  const handleRefresh = () => {
    onGetData();
  };


  useEffect(() => {
    onGetData();
  }, [searchParams]);


  return {
    ui: {
      isDrawerOpen,
      selectedReport,
      page,
      limit,
      pagination,
      loading,
    },
    data: {
      reports,
      kpis,
      query,
    },
    handler: {
      handleSelectReport,
      handleCloseDrawer,
      handleRefresh,
      onGetData,
      onProgress,
      onResolve,
      onRelease
    },
  };
}

export default useReportAdmin;
