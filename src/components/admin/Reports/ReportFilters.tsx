import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import RotateLeftRoundedIcon from "@mui/icons-material/RotateLeftRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import type { typeQueryReportAdmin } from "../../../types/admin/reportAdmin.type";
import { useSearchParams } from "react-router-dom";
import { ACCOUNT_REASONS, MESSAGE_REASONS, statusLabel } from "../../../data/Report.data";
import { getSelectStyle } from "../../../helpers/client/reportBadge.helper";

type ReportFiltersProps = {
  query: typeQueryReportAdmin;
  onRefresh: () => void;
}

export const ReportFilters = ({
  query,
  onRefresh
}: ReportFiltersProps) => {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();

  const reasonOptions = Array.from(
    new Map(
      [...MESSAGE_REASONS, ...ACCOUNT_REASONS].map((item) => [item.id, item])
    ).values()
  ).sort((a, b) => {
    if (a.id === "other") return 1; // a đứng sau b
    if (b.id === "other") return -1; // a đứng trước b
    return 0;
  });

  useEffect(() => {
    setSearchQuery(query.search || "");
  }, [query.search]);

  useEffect(() => {
    const currentFilterSearch = query.search || "";

    if (currentFilterSearch === searchQuery.trim()) {
      return;
    }

    const timer = setTimeout(() => {
      const nextParams = new URLSearchParams(searchParams);
      if (!searchQuery.trim()) {
        nextParams.delete("search");
        const hasOtherParams = Array.from(nextParams.keys()).some((k) => k !== "page");
        if (!hasOtherParams) {
          nextParams.delete("page");
        }
      } else {
        nextParams.set("search", searchQuery.trim());
        nextParams.set("page", "1");
      }
      setSearchParams(nextParams);
    }, 700);

    return () => clearTimeout(timer);
  }, [searchQuery, query.search, searchParams, setSearchParams]);

  const handleSelectChange = (key: string, value: string) => {
    const nextParams = new URLSearchParams(searchParams);

    if (!value || value === "all") {
      nextParams.delete(String(key));
    } else {
      nextParams.set(String(key), value);
    }

    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSearchParams(new URLSearchParams());
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("search");
    nextParams.set("page", "1");
    setSearchParams(nextParams);
  };

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const activeCount = [
    Boolean(searchQuery.trim()),
    Boolean(query.targetType && query.targetType !== "all"),
    Boolean(query.status && query.status !== "all"),
    Boolean(query.reason && query.reason !== "all"),
  ].filter(Boolean).length;

  const hasActiveFilters = activeCount > 0 || searchParams.toString().length > 0;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: { xs: 1.5, sm: 2 },
        p: { xs: 1.5, sm: 2 },
        bgcolor: "#FFFFFF",
        borderRadius: "16px",
        border: "1px solid #E2E8F0",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.03), 0 1px 2px -1px rgba(0, 0, 0, 0.03)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: "10px",
            px: 1.5,
            height: 40,
            flex: { xs: "1 1 100%", sm: "1 1 auto" },
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: "#CBD5E1",
            },
            "&:focus-within": {
              bgcolor: "#FFFFFF",
              borderColor: "#7C3AED",
              boxShadow: "0 0 0 3px rgba(124, 58, 237, 0.12)",
            },
          }}
        >
          <SearchIcon sx={{ color: "#94A3B8", fontSize: 20, mr: 1, flexShrink: 0 }} />
          <InputBase
            placeholder="Search by fullname, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              color: "#0F172A",
              fontSize: "0.85rem",
              width: "100%",
              "& ::placeholder": { color: "#94A3B8", opacity: 1 },
            }}
          />
          {searchQuery && (
            <IconButton
              size="small"
              onClick={handleClearSearch}
              sx={{
                p: 0.5,
                color: "#94A3B8",
                "&:hover": { color: "#64748B", bgcolor: "rgba(0,0,0,0.04)" },
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            justifyContent: { xs: "flex-end", sm: "flex-start" },
            flexShrink: 0,
          }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={handleRefreshClick}
            disabled={isRefreshing}
            startIcon={
              <RefreshRoundedIcon
                sx={{
                  fontSize: 18,
                  transition: "transform 0.5s ease",
                  transform: isRefreshing ? "rotate(360deg)" : "none",
                }}
              />
            }
            sx={{
              height: 40,
              textTransform: "none",
              fontSize: "0.835rem",
              fontWeight: 600,
              color: "#475569",
              borderColor: "#E2E8F0",
              bgcolor: "#FFFFFF",
              borderRadius: "10px",
              px: { xs: 1.5, sm: 2 },
              "&:hover": {
                bgcolor: "#F8FAFC",
                borderColor: "#CBD5E1",
                color: "#1E293B",
              },
            }}
          >
            Refresh
          </Button>

          {hasActiveFilters && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleReset}
              startIcon={<RotateLeftRoundedIcon sx={{ fontSize: 18 }} />}
              sx={{
                height: 40,
                textTransform: "none",
                fontSize: "0.835rem",
                fontWeight: 600,
                color: "#DC2626",
                borderColor: "#FCA5A5",
                bgcolor: "#FEF2F2",
                borderRadius: "10px",
                px: { xs: 1.5, sm: 2 },
                "&:hover": {
                  bgcolor: "#FEE2E2",
                  borderColor: "#F87171",
                },
              }}
            >
              Reset ({activeCount})
            </Button>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(3, 1fr)",
          },
          gap: { xs: 1, sm: 1.5 },
          alignItems: "center",
        }}
      >
        <FormControl fullWidth size="small">
          <Select
            value={query.targetType}
            onChange={(e) =>
              handleSelectChange("targetType", e.target.value)
            }
            displayEmpty
            sx={getSelectStyle(Boolean(query.targetType && query.targetType !== "all"))}
          >
            <MenuItem value="all" sx={{ fontSize: "0.835rem" }}>
              Type: All
            </MenuItem>
            <MenuItem value="message" sx={{ fontSize: "0.835rem" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ChatBubbleOutlineRoundedIcon
                  sx={{ fontSize: 16, color: "#7C3AED" }}
                />
                Type: Message
              </Box>
            </MenuItem>
            <MenuItem value="account" sx={{ fontSize: "0.835rem" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PersonOutlineRoundedIcon
                  sx={{ fontSize: 16, color: "#DC2626" }}
                />
                Type: Account
              </Box>
            </MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <Select
            value={query.status || "all"}
            onChange={(e) => handleSelectChange("status", e.target.value)}
            displayEmpty
            sx={getSelectStyle(Boolean(query.status && query.status !== "all"))}
          >
            <MenuItem value="all" sx={{ fontSize: "0.835rem" }}>
              Status: All
            </MenuItem>
            {Object.entries(statusLabel).map(([key, label]) => (
              <MenuItem key={key} value={key} sx={{ fontSize: "0.835rem" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor:
                        key === "pending"
                          ? "#F59E0B"
                          : key === "in_progress"
                            ? "#3B82F6"
                            : key === "resolved"
                              ? "#10B981"
                              : "#64748B",
                    }}
                  />
                  Status: {label}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <Select
            value={query.reason || "all"}
            onChange={(e) => handleSelectChange("reason", e.target.value)}
            displayEmpty
            sx={getSelectStyle(Boolean(query.reason && query.reason !== "all"))}
          >
            <MenuItem value="all" sx={{ fontSize: "0.835rem" }}>
              Reason: All
            </MenuItem>
            {reasonOptions.map((item) => (
              <MenuItem key={item.id} value={item.id} sx={{ fontSize: "0.835rem" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {item.icon}
                  Reason: {item.label}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};
