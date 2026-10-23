import React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import TablePagination from "@mui/material/TablePagination";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import type { IAdminReportItem } from "../../../types/admin/reportAdmin.type";
import type { ReportStatus, TicketPagination } from "../../../types/Report.type";
import { ACCOUNT_REASONS, MESSAGE_REASONS } from "../../../data/Report.data";
import { useSearchParams } from "react-router-dom";
import { ReportTableSkeleton } from "./ReportTableSkeleton";

export { ReportTableSkeleton };

type ReportTableProps = {
  reports: IAdminReportItem[];
  selectedReportId?: string | null;
  onViewDetail: (report: IAdminReportItem) => void;
  page: number;
  limit: number;
  pagination: TicketPagination;
  loading?: boolean;
}

export const ReportTable: React.FC<ReportTableProps> = ({
  reports,
  selectedReportId,
  onViewDetail,
  page,
  limit,
  pagination,
  loading = false,
}) => {
  const [searchParams,setSearchParams] = useSearchParams();
  
  const handleChangePage = (_: unknown, newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', (newPage + 1).toString());
    setSearchParams(newParams)
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('limit', event.target.value);
    newParams.set('page','1')
    setSearchParams(newParams)
  };

  const renderStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case "pending":
        return (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              px: 1.5,
              py: 0.4,
              borderRadius: "16px",
              bgcolor: "#FEF3C7",
              border: "1px solid #FDE68A",
              color: "#B45309",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            🟡 Pending
          </Box>
        );
      case "in_progress":
        return (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              px: 1.5,
              py: 0.4,
              borderRadius: "16px",
              bgcolor: "#EFF6FF",
              border: "1px solid #93C5FD",
              color: "#1D4ED8",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            🔵 In progress
          </Box>
        );
      case "resolved":
        return (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              px: 1.5,
              py: 0.4,
              borderRadius: "16px",
              bgcolor: "#ECFDF5",
              border: "1px solid #A7F3D0",
              color: "#059669",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            🟢 Resolved
          </Box>
        );
      case "rejected":
        return (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              px: 1.5,
              py: 0.4,
              borderRadius: "16px",
              bgcolor: "#F1F5F9",
              border: "1px solid #CBD5E1",
              color: "#475569",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            ⚪ Rejected
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Paper
      sx={{
        width: "100%",
        borderRadius: "16px",
        border: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <TableContainer>
        <Table sx={{ minWidth: 960 }}>
          <TableHead sx={{ bgcolor: "#FAFAFA", borderBottom: "1px solid #F1F5F9" }}>
            <TableRow>
              <TableCell
                sx={{
                  py: 1.5,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "#94A3B8",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                REPORTED BY
              </TableCell>
              <TableCell
                sx={{
                  py: 1.5,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "#94A3B8",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                TYPE
              </TableCell>

              <TableCell
                sx={{
                  py: 1.5,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "#94A3B8",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                REPORTED
              </TableCell>
              <TableCell
                sx={{
                  py: 1.5,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "#94A3B8",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                REASON
              </TableCell>
              <TableCell
                sx={{
                  py: 1.5,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "#94A3B8",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                STATUS
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  py: 1.5,
                  pr: 3,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "#94A3B8",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                ACTIONS
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <ReportTableSkeleton rows={limit || 10} />
            ) : reports?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <Typography variant="body2" sx={{ color: "#94A3B8", fontWeight: 500 }}>
                    No reports match the selected filters.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              reports.map((row) => {
                const isSelected = selectedReportId === row.id;

                return (
                  <TableRow
                    key={row.id}
                    hover
                    onClick={() => onViewDetail(row)}
                    sx={{
                      cursor: "pointer",
                      transition: "background-color 0.15s ease",
                      bgcolor: isSelected ? "#F5F3FF !important" : "inherit",
                      borderLeft: isSelected
                        ? "4px solid #7C3AED"
                        : "4px solid transparent",
                      borderBottom: "1px solid #F1F5F9",
                      "&:hover": {
                        bgcolor: isSelected ? "#EDE9FE !important" : "#F8FAFC !important",
                      },
                    }}
                  >
                    <TableCell sx={{ py: 1.75 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "#0F172A",
                          fontSize: "0.86rem",
                        }}
                      >
                        {row.reporterName}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ py: 1.75 }}>
                      {row.targetType === "message" ? (
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.6,
                            px: 1.25,
                            py: 0.35,
                            borderRadius: "14px",
                            bgcolor: "#EDE9FE",
                            color: "#7C3AED",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                          }}
                        >
                          <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 13 }} />
                          Message
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.6,
                            px: 1.25,
                            py: 0.35,
                            borderRadius: "14px",
                            bgcolor: "#FEE2E2",
                            color: "#DC2626",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                          }}
                        >
                          <PersonOutlineRoundedIcon sx={{ fontSize: 13 }} />
                          Account
                        </Box>
                      )}
                    </TableCell>

                    <TableCell sx={{ py: 1.75 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar
                          src={row.targetUser.avatar || undefined}
                          sx={{
                            width: 36,
                            height: 36,
                            color: "#FFFFFF",
                            bgcolor: row.targetType === "account" ? "#EF4444" : "#6366F1",
                            fontSize: "0.85rem",
                            fontWeight: 700,
                          }}
                        >
                          {row.targetUser.fullName?.charAt(0)?.toUpperCase() || "U"}
                        </Avatar>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: "#0F172A",
                              fontSize: "0.86rem",
                            }}
                          >
                            {row.targetUser.fullName}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#64748B", fontSize: "0.75rem" }}
                          >
                            {row.targetUser.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ py: 1.75 }}>
                      <Box
                        sx={{
                          display: "inline-block",
                          px: 1.25,
                          py: 0.35,
                          borderRadius: "8px",
                          bgcolor: "#F8FAFC",
                          border: "1px solid #E2E8F0",
                          color: "#475569",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                        }}
                      >
                        {(row.targetType === "message" ? MESSAGE_REASONS : ACCOUNT_REASONS).find(
                          (r) => r.id === row.reason
                        )?.label || row.reason}
                      </Box>
                    </TableCell>

                    <TableCell sx={{ py: 1.75 }}>
                      {renderStatusBadge(row.status)}
                    </TableCell>

                    <TableCell align="right" sx={{ py: 1.75, pr: 3 }}>
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: 0.5,
                        }}
                      >
                        <Tooltip title="View Details" arrow>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewDetail(row);
                            }}
                            sx={{
                              color: isSelected ? "#7C3AED" : "#64748B",
                              p: 0.75,
                              borderRadius: "8px",
                              bgcolor: isSelected
                                ? "rgba(124, 58, 237, 0.1)"
                                : "transparent",
                              "&:hover": {
                                color: "#7C3AED",
                                bgcolor: "rgba(124, 58, 237, 0.08)",
                              },
                            }}
                          >
                            <VisibilityRoundedIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 25]}
        component="div"
        count={pagination?.total || 0}
        rowsPerPage={limit || 10}
        page={Math.max(0, (page || 1) - 1)}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: "1px solid #F1F5F9",
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
            fontSize: "0.8rem",
            color: "#64748B",
          },
        }}
      />
    </Paper>
  );
};
