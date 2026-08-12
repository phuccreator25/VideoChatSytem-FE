import { useEffect, useMemo, useState } from "react";
import { enqueueSnackbar } from "notistack";
import authApi from "../../api/Auth.api";
import type { DeviceSessionItem } from "../../types/auth.type";
import { parseDeviceDetails } from "../../helpers/parseDevice.helper";

export default function useActiveSessions(open: boolean) {
  const [sessions, setSessions] = useState<DeviceSessionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [banningSessionId, setBanningSessionId] = useState<string | null>(null);
  const [isBanningAll, setIsBanningAll] = useState<boolean>(false);

  const fetchListSession = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await authApi.onGetListSession();
      const sessionData = (res.data?.data || res.data || []) as DeviceSessionItem[];
      setSessions(sessionData);
    } catch (err: any) {
      console.error("Lỗi khi tải danh sách session:", err);
      setErrorMsg("Unable to load active sessions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    fetchListSession();
  }, [open]);

  const handleBanSession = async (sessionId: string) => {
    if (!sessionId) return;

    setBanningSessionId(sessionId);
    try {
      await authApi.onBanSession(sessionId);

      enqueueSnackbar("Session revoked successfully", { variant: "success" });

      setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));

    } catch (error: any) {
      console.error("Ban session failed:", error);
      enqueueSnackbar(
        error?.response?.data?.message || "Failed to revoke session",
        { variant: "error" }
      );
    } finally {
      setBanningSessionId(null);
    }
  };

  const handleBanAllOtherSessions = async () => {
    setIsBanningAll(true);
    try {
      await authApi.onBanAllOtherSessions();

      enqueueSnackbar("All other sessions have been revoked successfully", { variant: "success" });

      setSessions((prev) => prev.filter((s) => s.isCurrentSession));

    } catch (error: any) {
      console.error("Ban all sessions failed:", error);
      enqueueSnackbar(
        error?.response?.data?.message || "Failed to revoke other sessions",
        { variant: "error" }
      );
    } finally {
      setIsBanningAll(false);
    }
  };

  // Filter sessions by search query
  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;

    const query = searchQuery.toLowerCase().trim();

    return sessions.filter((s) => {
      const details = parseDeviceDetails(s.userAgent || "");

      return (
        details.browserName.toLowerCase().includes(query) ||
        details.osName.toLowerCase().includes(query) ||
        s.ipAddress?.toLowerCase().includes(query) ||
        s.deviceId?.toLowerCase().includes(query)
      );
    });
  }, [sessions, searchQuery]);

  return {
    ui: {
      sessions,
      filteredSessions,
      isLoading,
      searchQuery,
      errorMsg,
      banningSessionId,
      isBanningAll,
    },
    handlers: {
      fetchListSession,
      handleBanSession,
      handleBanAllOtherSessions,
      setSearchQuery,
    },
  };
}
