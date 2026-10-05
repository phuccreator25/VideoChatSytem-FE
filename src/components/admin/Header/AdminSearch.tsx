import React, { useState } from "react";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import Chip from "@mui/material/Chip";
import SearchIcon from "@mui/icons-material/Search";

type AdminSearchProps = {
  onSearch?: (query: string) => void;
};

export const AdminSearch = ({ onSearch }: AdminSearchProps) => {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        bgcolor: "#F8FAFC",
        border: "1px solid #E2E8F0",
        borderRadius: "10px",
        px: 1.5,
        py: 0.5,
        width: { xs: 160, sm: 260, md: 320 },
        transition: "all 0.2s ease",
        "&:focus-within": {
          bgcolor: "#FFFFFF",
          borderColor: "#7C3AED",
          boxShadow: "0 0 0 3px rgba(124, 58, 237, 0.12)",
        },
      }}
    >
      <SearchIcon sx={{ color: "#94A3B8", fontSize: 20, mr: 1 }} />
      <InputBase
        placeholder="Search users, rooms, logs..."
        value={value}
        onChange={handleChange}
        sx={{
          color: "#0F172A",
          fontSize: "0.85rem",
          width: "100%",
          "& ::placeholder": {
            color: "#94A3B8",
            opacity: 1,
          },
        }}
      />
      <Chip
        label="Ctrl K"
        size="small"
        sx={{
          display: { xs: "none", sm: "flex" },
          height: 20,
          fontSize: "0.65rem",
          fontWeight: 700,
          bgcolor: "#FFFFFF",
          color: "#64748B",
          borderRadius: "4px",
          border: "1px solid #E2E8F0",
          px: 0.2,
        }}
      />
    </Box>
  );
};
