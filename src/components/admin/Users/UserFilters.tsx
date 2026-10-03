import {
  Box,
  InputBase,
  Select,
  MenuItem,
  FormControl,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RotateLeftRoundedIcon from "@mui/icons-material/RotateLeftRounded";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { typeQueryUser } from "../../../types/admin/userAdmin.type";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { roleList } from "../../../data/user.data";

type UserFiltersProps = {
  filters: typeQueryUser;
  onFetchData: () => Promise<void>;
};

export const UserFilters = ({ filters, onFetchData }: UserFiltersProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState<string>(filters.search || "");

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
    }, 1000);

    // Xóa timer cũ khi user gõ tiếp trước khi đủ 1s
    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleSelectChange = (
    key: string,
    value: string
  ) => {
    const nextParams = new URLSearchParams(searchParams);

    if (!value || value === "all") {
      nextParams.delete(String(key));
    } else {
      nextParams.set(String(key), value);
    }

    nextParams.set("page", "1");
    setSearchParams(nextParams);
  };

  const handleReset = () => {
    setSearchValue("");
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(
    filters.search ||
    (filters.role && filters.role !== "all") ||
    (filters.isOnline && filters.isOnline !== "all") ||
    (filters.isActive && filters.isActive !== "all") ||
    (filters.isBanned && filters.isBanned !== "all")
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        alignItems: { xs: "stretch", lg: "center" },
        justifyContent: "space-between",
        gap: 1.5,
        p: 2,
        bgcolor: "#FFFFFF",
        borderRadius: "14px",
        border: "1px solid #E2E8F0",
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
          py: 0.6,
          flex: { xs: "1", lg: "0 1 320px" },
          transition: "all 0.2s ease",
          "&:focus-within": {
            bgcolor: "#FFFFFF",
            borderColor: "#7C3AED",
            boxShadow: "0 0 0 3px rgba(124, 58, 237, 0.1)",
          },
        }}
      >
        <SearchIcon sx={{ color: "#94A3B8", fontSize: 20, mr: 1 }} />
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
      </Box>

      {/* Select Filter Dropdowns */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Button
          size="small"
          onClick={onFetchData}
          startIcon={<RefreshRoundedIcon sx={{ fontSize: 16 }} />}
          sx={{
            textTransform: "none",
            fontSize: "0.8rem",
            color: "#EF4444",
            borderRadius: "8px",
            px: 1.5,
            "&:hover": { bgcolor: "#FEE2E2" },
          }}
        >
          Refresh
        </Button>
        {/* Role Filter */}
        <FormControl size="small" sx={{ minWidth: 110 }}>
          <Select
            value={filters.role}
            onChange={(e) => handleSelectChange('role', e.target.value)}
            displayEmpty
            sx={{
              fontSize: "0.825rem",
              borderRadius: "10px",
              bgcolor: "#F8FAFC",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#CBD5E1" },
            }}
          >
            {roleList.map((role) => (
              <MenuItem key={role.value} value={role.value} sx={{ fontSize: "0.825rem" }}>
                {role.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* isOnline Filter */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={filters.isOnline}
            onChange={(e) => handleSelectChange('isOnline', e.target.value)}
            displayEmpty
            sx={{
              fontSize: "0.825rem",
              borderRadius: "10px",
              bgcolor: "#F8FAFC",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" },
            }}
          >
            <MenuItem value="all" sx={{ fontSize: "0.825rem" }}>Status: All</MenuItem>
            <MenuItem value="true" sx={{ fontSize: "0.825rem" }}>Online</MenuItem>
            <MenuItem value="false" sx={{ fontSize: "0.825rem" }}>Offline</MenuItem>
          </Select>
        </FormControl>

        {/* isActive Filter */}
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <Select
            value={filters.isActive}
            onChange={(e) => handleSelectChange('isActive', e.target.value)}
            displayEmpty
            sx={{
              fontSize: "0.825rem",
              borderRadius: "10px",
              bgcolor: "#F8FAFC",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" },
            }}
          >
            <MenuItem value="all" sx={{ fontSize: "0.825rem" }}>Verify: All</MenuItem>
            <MenuItem value="true" sx={{ fontSize: "0.825rem" }}>Active</MenuItem>
            <MenuItem value="false" sx={{ fontSize: "0.825rem" }}>Pending</MenuItem>
          </Select>
        </FormControl>

        {/* isBanned Filter */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={filters.isBanned}
            onChange={(e) => handleSelectChange('isBanned', e.target.value)}
            displayEmpty
            sx={{
              fontSize: "0.825rem",
              borderRadius: "10px",
              bgcolor: "#F8FAFC",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" },
            }}
          >
            <MenuItem value="all" sx={{ fontSize: "0.825rem" }}>Ban: All</MenuItem>
            <MenuItem value="false" sx={{ fontSize: "0.825rem" }}>Normal</MenuItem>
            <MenuItem value="true" sx={{ fontSize: "0.825rem" }}>Banned</MenuItem>
          </Select>
        </FormControl>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            size="small"
            onClick={handleReset}
            startIcon={<RotateLeftRoundedIcon sx={{ fontSize: 16 }} />}
            sx={{
              textTransform: "none",
              fontSize: "0.8rem",
              color: "#EF4444",
              borderRadius: "8px",
              px: 1.5,
              "&:hover": { bgcolor: "#FEE2E2" },
            }}
          >
            Reset
          </Button>
        )}
      </Box>
    </Box>
  );
};
