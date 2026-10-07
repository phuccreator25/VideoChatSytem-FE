import React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

type CallTableSkeletonProps = {
  rows?: number;
};

export const CallTableSkeleton: React.FC<CallTableSkeletonProps> = ({ rows = 6 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow
          key={`call-skeleton-row-${index}`}
          sx={{
            borderBottom: "1px solid #F1F5F9",
            "& td": {
              borderColor: "#F1F5F9",
            },
          }}
        >
          {/* Caller */}
          <TableCell sx={{ py: 2, pl: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Skeleton
                variant="circular"
                width={38}
                height={38}
                animation="wave"
                sx={{ bgcolor: "#F1F5F9" }}
              />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Skeleton
                  variant="text"
                  width={110}
                  height={18}
                  animation="wave"
                  sx={{ bgcolor: "#F1F5F9", borderRadius: "4px" }}
                />
                <Skeleton
                  variant="text"
                  width={140}
                  height={14}
                  animation="wave"
                  sx={{ bgcolor: "#F8FAFC", borderRadius: "4px" }}
                />
              </Box>
            </Box>
          </TableCell>

          {/* Callee */}
          <TableCell sx={{ py: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Skeleton
                variant="circular"
                width={38}
                height={38}
                animation="wave"
                sx={{ bgcolor: "#F1F5F9" }}
              />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Skeleton
                  variant="text"
                  width={110}
                  height={18}
                  animation="wave"
                  sx={{ bgcolor: "#F1F5F9", borderRadius: "4px" }}
                />
                <Skeleton
                  variant="text"
                  width={140}
                  height={14}
                  animation="wave"
                  sx={{ bgcolor: "#F8FAFC", borderRadius: "4px" }}
                />
              </Box>
            </Box>
          </TableCell>

          {/* Type */}
          <TableCell sx={{ py: 2 }}>
            <Skeleton
              variant="rounded"
              width={75}
              height={26}
              animation="wave"
              sx={{ borderRadius: "20px", bgcolor: "#F1F5F9" }}
            />
          </TableCell>

          {/* Duration */}
          <TableCell sx={{ py: 2 }}>
            <Skeleton
              variant="text"
              width={55}
              height={20}
              animation="wave"
              sx={{ bgcolor: "#F1F5F9", borderRadius: "4px" }}
            />
          </TableCell>

          {/* Status */}
          <TableCell sx={{ py: 2 }}>
            <Skeleton
              variant="rounded"
              width={85}
              height={26}
              animation="wave"
              sx={{ borderRadius: "20px", bgcolor: "#F1F5F9" }}
            />
          </TableCell>

          {/* End Reason */}
          <TableCell sx={{ py: 2 }}>
            <Skeleton
              variant="rounded"
              width={160}
              height={32}
              animation="wave"
              sx={{ borderRadius: "10px", bgcolor: "#F1F5F9" }}
            />
          </TableCell>

          {/* Started At */}
          <TableCell sx={{ py: 2 }}>
            <Skeleton
              variant="text"
              width={125}
              height={18}
              animation="wave"
              sx={{ bgcolor: "#F1F5F9", borderRadius: "4px" }}
            />
          </TableCell>

          {/* Actions */}
          <TableCell align="right" sx={{ py: 2, pr: 3 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                justifyContent: "flex-end",
              }}
            >
              <Skeleton
                variant="circular"
                width={30}
                height={30}
                animation="wave"
                sx={{ bgcolor: "#F1F5F9" }}
              />
            </Box>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
