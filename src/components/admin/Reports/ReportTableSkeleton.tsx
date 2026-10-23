import React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

type ReportTableSkeletonProps = {
  rows?: number;
};

export const ReportTableSkeleton: React.FC<ReportTableSkeletonProps> = ({ rows = 6 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow
          key={`report-skeleton-row-${index}`}
          sx={{
            borderBottom: "1px solid #F1F5F9",
            "& td": {
              borderColor: "#F1F5F9",
            },
          }}
        >
          {/* Người báo cáo */}
          <TableCell sx={{ py: 1.75 }}>
            <Skeleton
              variant="text"
              width={120}
              height={20}
              animation="wave"
              sx={{ borderRadius: "4px" }}
            />
          </TableCell>

          {/* Loại */}
          <TableCell sx={{ py: 1.75 }}>
            <Skeleton
              variant="rounded"
              width={86}
              height={26}
              animation="wave"
              sx={{ borderRadius: "14px" }}
            />
          </TableCell>

          {/* Đối tượng bị báo cáo */}
          <TableCell sx={{ py: 1.75 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Skeleton
                variant="circular"
                width={36}
                height={36}
                animation="wave"
              />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Skeleton
                  variant="text"
                  width={110}
                  height={18}
                  animation="wave"
                  sx={{ borderRadius: "4px" }}
                />
                <Skeleton
                  variant="text"
                  width={80}
                  height={14}
                  animation="wave"
                  sx={{ borderRadius: "4px" }}
                />
              </Box>
            </Box>
          </TableCell>

          {/* Lý do vi phạm */}
          <TableCell sx={{ py: 1.75 }}>
            <Skeleton
              variant="rounded"
              width={130}
              height={28}
              animation="wave"
              sx={{ borderRadius: "8px" }}
            />
          </TableCell>

          {/* Trạng thái */}
          <TableCell sx={{ py: 1.75 }}>
            <Skeleton
              variant="rounded"
              width={96}
              height={26}
              animation="wave"
              sx={{ borderRadius: "16px" }}
            />
          </TableCell>

          {/* Thao tác */}
          <TableCell align="right" sx={{ py: 1.75, pr: 3 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Skeleton
                variant="circular"
                width={32}
                height={32}
                animation="wave"
              />
            </Box>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default ReportTableSkeleton;
