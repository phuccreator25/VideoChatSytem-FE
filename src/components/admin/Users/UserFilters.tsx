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
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { typeQueryUser } from "../../../types/admin/userAdmin.type";
import { roleList } from "../../../data/user.data";

type UserFiltersProps = {
  filters: typeQueryUser;
  onFetchData: () => Promise<void>;
};

export const UserFilters = ({ filters, onFetchData }: UserFiltersProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState<string>(filters.search || "");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync internal search state when filter prop changes externally (e.g. on reset/popstate)
  useEffect(() => {
    setSearchValue(filters.search || "");
  }, [filters.search]);

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

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextParams = new URLSearchParams(searchParams);
      if (!searchValue.trim()) {
        nextParams.delete("search");
      } else {
        nextParams.set("search", searchValue.trim());
      }
      nextParams.set("page", "1");
      setSearchParams(nextParams);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onFetchData();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleReset = () => {
    setSearchValue("");
    setSearchParams(new URLSearchParams());
  };

  const activeCount = [
    Boolean(filters.search?.trim()),
    Boolean(filters.role && filters.role !== "all"),
    Boolean(filters.isOnline && filters.isOnline !== "all"),
    Boolean(filters.isActive && filters.isActive !== "all"),
    Boolean(filters.isBanned && filters.isBanned !== "all"),
  ].filter(Boolean).length;

  const hasActiveFilters = activeCount > 0;

  // Custom styling helper for Select filters when active
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
      {/* Top Row: Search Input & Action Buttons */}
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
            onKeyDown={handleSearchKeyDown}
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

        {/* Action Buttons: Refresh & Clear Filters */}
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
            onClick={handleRefresh}
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
        {/* Role Filter */}
        <FormControl fullWidth size="small">
          <Select
            value={filters.role || "all"}
            onChange={(e) => handleSelectChange("role", e.target.value)}
            displayEmpty
            sx={getSelectStyle(Boolean(filters.role && filters.role !== "all"))}
          >
            {roleList.map((role) => (
              <MenuItem key={role.value} value={role.value} sx={{ fontSize: "0.835rem" }}>
                {role.value === "all" ? "Role: All" : `Role: ${role.label}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* isOnline Filter */}
        <FormControl fullWidth size="small">
          <Select
            value={filters.isOnline || "all"}
            onChange={(e) => handleSelectChange("isOnline", e.target.value)}
            displayEmpty
            sx={getSelectStyle(Boolean(filters.isOnline && filters.isOnline !== "all"))}
          >
            <MenuItem value="all" sx={{ fontSize: "0.835rem" }}>
              Status: All
            </MenuItem>
            <MenuItem value="true" sx={{ fontSize: "0.835rem" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#10B981" }} />
                Status: Online
              </Box>
            </MenuItem>
            <MenuItem value="false" sx={{ fontSize: "0.835rem" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#94A3B8" }} />
                Status: Offline
              </Box>
            </MenuItem>
          </Select>
        </FormControl>

        {/* isActive Filter */}
        <FormControl fullWidth size="small">
          <Select
            value={filters.isActive || "all"}
            onChange={(e) => handleSelectChange("isActive", e.target.value)}
            displayEmpty
            sx={getSelectStyle(Boolean(filters.isActive && filters.isActive !== "all"))}
          >
            <MenuItem value="all" sx={{ fontSize: "0.835rem" }}>
              Verify: All
            </MenuItem>
            <MenuItem value="true" sx={{ fontSize: "0.835rem" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#06B6D4" }} />
                Verify: Active
              </Box>
            </MenuItem>
            <MenuItem value="false" sx={{ fontSize: "0.835rem" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#F59E0B" }} />
                Verify: Pending
              </Box>
            </MenuItem>
          </Select>
        </FormControl>

        {/* isBanned Filter */}
        <FormControl fullWidth size="small">
          <Select
            value={filters.isBanned || "all"}
            onChange={(e) => handleSelectChange("isBanned", e.target.value)}
            displayEmpty
            sx={getSelectStyle(Boolean(filters.isBanned && filters.isBanned !== "all"))}
          >
            <MenuItem value="all" sx={{ fontSize: "0.835rem" }}>
              Ban: All
            </MenuItem>
            <MenuItem value="false" sx={{ fontSize: "0.835rem" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#10B981" }} />
                Ban: Normal
              </Box>
            </MenuItem>
            <MenuItem value="true" sx={{ fontSize: "0.835rem" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#EF4444" }} />
                Ban: Banned
              </Box>
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};
