import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import RotateLeftRoundedIcon from "@mui/icons-material/RotateLeftRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import type { typeQueryCallAdmin } from "../../../types/admin/callAdmin.type";
import {
  statusCallAdmin,
  typeCallAdmin,
  endReasonCallAdmin,
} from "../../../data/callAdmin.data";
import { useSearchParams } from "react-router-dom";

type CallFiltersProps = {
  filters: typeQueryCallAdmin;
  onGetData: () => void
};

export const CallFilters = ({
  filters,
  onGetData,
}: CallFiltersProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState<string>(filters.search || "");
  const [dateAnchorEl, setDateAnchorEl] = useState<HTMLButtonElement | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setSearchValue(filters.search || "");
  }, [filters.search]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onGetData();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    const currentFilterSearch = filters.search || "";

    // Tránh set lại URL nếu giá trị search không thay đổi
    if (currentFilterSearch === searchValue.trim()) {
      return;
    }

    const timer = setTimeout(() => {
      const nextParams = new URLSearchParams(searchParams);
      if (!searchValue.trim()) {
        nextParams.delete("search");
      } else {
        nextParams.set("search", searchValue.trim());
      }
      nextParams.set("page", "1");
      setSearchParams(nextParams);
    }, 700);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleSelectChange = (key: string, value: string) => {
    const nextParams = new URLSearchParams(searchParams);

    if (!value || value === "all") {
      nextParams.delete(String(key));
    } else {
      nextParams.set(String(key), value);
    }

    nextParams.set("page", "1");
    setSearchParams(nextParams);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("search");
    nextParams.set("page", "1");
    setSearchParams(nextParams);
  };

  const handleDatePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDateAnchorEl(event.currentTarget);
  };

  const handleDatePopoverClose = () => {
    setDateAnchorEl(null);
  };

  const handleResetFilters = () => {
    setSearchValue("");
    setSearchParams(new URLSearchParams());
  };

  // Tính số lượng bộ lọc đang active
  const activeCount = [
    Boolean(searchValue.trim() || filters.search?.trim()),
    Boolean(filters.status && filters.status !== "all"),
    Boolean(filters.type && filters.type !== "all"),
    Boolean(filters.endReason && filters.endReason !== "all"),
    Boolean(filters.startDate && filters.startDate !== "2026-10-01"),
  ].filter(Boolean).length;

  const hasActiveFilters = activeCount > 0;
  const isDateActive = Boolean(filters.startDate || filters.endDate);

  // Custom styling helper for Select filters when active (Chuẩn hệ thống Orbit)
  const getSelectStyle = (isActive: boolean) => ({
    height: 40,
    fontSize: "0.835rem",
    fontWeight: isActive ? 600 : 500,
    borderRadius: "10px",
    bgcolor: isActive ? "#F5F3FF" : "#F8FAFC",
    color: isActive ? "#7C3AED" : "#334155",
    transition: "all 0.2s ease",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: isActive ? "#A78BFA" : "#E2E8F0",
      borderWidth: isActive ? "1.5px" : "1px",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: isActive ? "#7C3AED" : "#CBD5E1",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#7C3AED",
      boxShadow: "0 0 0 3px rgba(124, 58, 237, 0.12)",
    },
    "& .MuiSelect-select": {
      py: 1,
      px: 1.5,
      display: "flex",
      alignItems: "center",
    },
  });

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
      {/* Top Row: Search Input & Action Buttons (Refresh & Reset) */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        {/* Search Input */}
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
            placeholder="Search by name, username, email..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{
              color: "#0F172A",
              fontSize: "0.85rem",
              width: "100%",
              "& ::placeholder": { color: "#94A3B8", opacity: 1 },
            }}
          />
          {searchValue && (
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

        {/* Action Buttons: Refresh & Reset */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            justifyContent: { xs: "flex-end", sm: "flex-start" },
            flexShrink: 0,
          }}
        >
          {/* Refresh Button */}
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleRefresh()}
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

          {/* Reset Active Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleResetFilters}
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

      {/* Bottom Grid: Filter Select Dropdowns */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: { xs: 1, sm: 1.5 },
          alignItems: "center",
        }}
      >
        {/* 1. Status Filter */}
        <FormControl fullWidth size="small">
          <Select
            value={filters.status || "all"}
            onChange={(e) => handleSelectChange("status", e.target.value)}
            displayEmpty
            sx={getSelectStyle(Boolean(filters.status && filters.status !== "all"))}
          >
            {statusCallAdmin.map((item) => (
              <MenuItem key={item.value} value={item.value} sx={{ fontSize: "0.835rem" }}>
                {item.color ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: item.color }} />
                    {item.label}
                  </Box>
                ) : (
                  item.label
                )}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 2. Type Filter */}
        <FormControl fullWidth size="small">
          <Select
            value={filters.type || "all"}
            onChange={(e) => handleSelectChange("type", e.target.value)}
            displayEmpty
            sx={getSelectStyle(Boolean(filters.type && filters.type !== "all"))}
          >
            {typeCallAdmin.map((item) => (
              <MenuItem key={item.value} value={item.value} sx={{ fontSize: "0.835rem" }}>
                {item.color ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: item.color }} />
                    {item.label}
                  </Box>
                ) : (
                  item.label
                )}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 3. End Reason Filter */}
        <FormControl fullWidth size="small">
          <Select
            value={filters.endReason || "all"}
            onChange={(e) => handleSelectChange("endReason", e.target.value)}
            displayEmpty
            sx={getSelectStyle(Boolean(filters.endReason && filters.endReason !== "all"))}
          >
            {endReasonCallAdmin.map((item) => (
              <MenuItem key={item.value} value={item.value} sx={{ fontSize: "0.835rem" }}>
                {item.color ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: item.color }} />
                    {item.label}
                  </Box>
                ) : (
                  item.label
                )}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 4. Date Range Filter Button & Popover */}
        <Box sx={{ width: "100%" }}>
          <Button
            fullWidth
            onClick={handleDatePopoverOpen}
            startIcon={
              <CalendarMonthRoundedIcon
                sx={{
                  fontSize: 18,
                  color: isDateActive ? "#7C3AED" : "#64748B",
                }}
              />
            }
            sx={{
              ...getSelectStyle(isDateActive),
              justifyContent: "flex-start",
              textTransform: "none",
              px: 1.5,
              width: "100%",
            }}
          >
            {isDateActive 
            ? `Date: ${filters.startDate || '...'} - ${filters.endDate || '...'}` 
            : "Date: All"}
          </Button>

          <Popover
            open={Boolean(dateAnchorEl)}
            anchorEl={dateAnchorEl}
            onClose={handleDatePopoverClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{
              sx: {
                p: 2,
                mt: 1,
                borderRadius: "12px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                border: "1px solid #E2E8F0",
                minWidth: 280,
              },
            }}
          >
            <Typography sx={{ fontSize: "0.875rem", fontWeight: 700, color: "#0F172A", mb: 1.5 }}>
              Date range
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <TextField
                label="From date"
                type="date"
                size="small"
                value={filters.startDate && filters.startDate !== "all" ? filters.startDate : ""}
                onChange={(e) => handleSelectChange("startDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
              />
              <TextField
                label="To date"
                type="date"
                size="small"
                value={filters.endDate && filters.endDate !== "all" ? filters.endDate : ""}
                onChange={(e) => handleSelectChange("endDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleDatePopoverClose}
                sx={{
                  bgcolor: "#7C3AED",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#6D28D9" },
                }}
              >
                Apply   
              </Button>
            </Box>
          </Popover>
        </Box>
      </Box>
    </Box>
  );
};
