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
import WifiOffRoundedIcon from "@mui/icons-material/WifiOffRounded";
import TimerOffRoundedIcon from "@mui/icons-material/TimerOffRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { CallStatusBadge } from "./CallStatusBadge";
import { CallTypeBadge } from "./CallTypeBadge";
import { CallTableSkeleton } from "./CallTableSkeleton";
import type { CallItem } from "../../../types/admin/callAdmin.type";
import { endReasonDisplay } from "../../../data/callAdmin.data";
import { maskEmail } from "../../../helpers/admin/userAdmin.helper";
import { formatDate, formatDuration } from "../../../helpers/formatDate.helper";
import { useSearchParams } from "react-router-dom";

type CallTableProps = {
  calls: CallItem[];
  onViewDetail: (call: CallItem) => void;
  page?: number;
  total?: number;
  limit?: number;
  loading?: boolean;
};

export const CallTable = ({
  calls,
  onViewDetail,
  page = 1,
  total = 23,
  limit = 10,
  loading = false,
}: CallTableProps) => {
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
              {/* LƯU Ý: ĐÃ BỎ CỘT ID THEO YÊU CẦU */}
              <TableCell sx={{ py: 1.75, pl: 3, fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Caller
              </TableCell>
              <TableCell sx={{ py: 1.75, fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Callee
              </TableCell>
              <TableCell sx={{ py: 1.75, fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Type
              </TableCell>
              <TableCell sx={{ py: 1.75, fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Duration
              </TableCell>
              <TableCell sx={{ py: 1.75, fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Status
              </TableCell>
              <TableCell sx={{ py: 1.75, fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                End Reason
              </TableCell>
              <TableCell sx={{ py: 1.75, fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Started At
              </TableCell>
              <TableCell align="right" sx={{ py: 1.75, pr: 3, fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <CallTableSkeleton rows={limit} />
            ) : calls.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                  <Typography variant="body2" sx={{ color: "#94A3B8", fontWeight: 500 }}>
                    No calls match the selected filters.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              calls.map((call) => {
              const caller = call.participants.find((p) => p.role === "caller") || call.participants[0];
              const callee = call.participants.find((p) => p.role === "callee") || call.participants[1];

              return (
                <TableRow
                  key={call._id}
                  hover
                  onClick={() => onViewDetail(call)}
                  sx={{
                    transition: "background-color 0.15s ease",
                    "&:hover": {
                      bgcolor: "#F8FAFC",
                    },
                    "& td": {
                      borderColor: "#F1F5F9",
                    },
                    cursor: "pointer",
                  }}
                >
                  {/* Caller */}
                  <TableCell sx={{ py: 2, pl: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar
                        src={caller.avatar}
                        sx={{
                          width: 38,
                          height: 38,
                          color: "#FFFFFF",
                          fontSize: "0.875rem",
                          fontWeight: 700,
                        }}
                      >
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontSize: "0.86rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.25 }}>
                          {caller?.fullname || "Caller"}
                        </Typography>
                        <Typography sx={{ fontSize: "0.76rem", color: "#64748B", mt: 0.25 }}>
                          {maskEmail(caller?.email) || caller?.username }
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Callee */}
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar
                        src={callee.avatar}
                        sx={{
                          width: 38,
                          height: 38,
                          color: "#FFFFFF",
                          fontSize: "0.875rem",
                          fontWeight: 700,
                        }}
                      >
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontSize: "0.86rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.25 }}>
                          {callee?.fullname || "Callee"}
                        </Typography>
                        <Typography sx={{ fontSize: "0.76rem", color: "#64748B", mt: 0.25 }}>
                          {maskEmail(callee?.email) || callee?.username }
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Type */}
                  <TableCell sx={{ py: 2 }}>
                    <CallTypeBadge type={call.type} />
                  </TableCell>

                  {/* Duration */}
                  <TableCell sx={{ py: 2 }}>
                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#0F172A", fontFamily: "monospace" }}>
                      {formatDuration(call.duration, call.status)}
                    </Typography>
                  </TableCell>

                  {/* Status */}
                  <TableCell sx={{ py: 2 }}>
                    <CallStatusBadge status={call.status} />
                  </TableCell>

                  {/* End Reason */}
                  <TableCell sx={{ py: 2, minWidth: 220, whiteSpace: "normal" }}>
                    {(() => {
                      if (call.status === "active") {
                        return (
                          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
                            <Box
                              sx={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                bgcolor: "#10B981",
                                boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.25)",
                              }}
                            />
                            <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#059669" }}>
                              In a call
                            </Typography>
                          </Box>
                        );
                      }

                      if (call.status === "ringing") {
                        return (
                          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
                            <Box
                              sx={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                bgcolor: "#F59E0B",
                                boxShadow: "0 0 0 2px rgba(245, 158, 11, 0.25)",
                              }}
                            />
                            <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#D97706" }}>
                              Ringing
                            </Typography>
                          </Box>
                        );
                      }

                      const reasonItem = endReasonDisplay.find((item) => item.value === call.endReason);

                      if (reasonItem) {
                        const styleConfig: Record<
                          string,
                          { bg: string; border: string; text: string; icon: React.ReactNode }
                        > = {
                          normal: {
                            bg: "#ECFDF5",
                            border: "#A7F3D0",
                            text: "#059669",
                            icon: <CheckCircleOutlineRoundedIcon sx={{ fontSize: 14, color: "#059669" }} />,
                          },
                          network_lost: {
                            bg: "#FFFBEB",
                            border: "#FDE68A",
                            text: "#D97706",
                            icon: <WifiOffRoundedIcon sx={{ fontSize: 14, color: "#D97706" }} />,
                          },
                          timeout: {
                            bg: "#F8FAFC",
                            border: "#E2E8F0",
                            text: "#64748B",
                            icon: <TimerOffRoundedIcon sx={{ fontSize: 14, color: "#64748B" }} />,
                          },
                        };

                        const currentStyle = styleConfig[reasonItem.value] || {
                          bg: "#F8FAFC",
                          border: "#E2E8F0",
                          text: "#64748B",
                          icon: null,
                        };

                        return (
                          <Tooltip title={`Type: ${reasonItem.label}`} arrow placement="top">
                            <Box
                              sx={{
                                display: "inline-flex",
                                alignItems: "flex-start",
                                gap: 0.75,
                                px: 1.25,
                                py: 0.5,
                                borderRadius: "10px",
                                bgcolor: currentStyle.bg,
                                border: `1px solid ${currentStyle.border}`,
                                maxWidth: 260,
                              }}
                            >
                              <Box sx={{ display: "flex", alignItems: "center", mt: "2px", flexShrink: 0 }}>
                                {currentStyle.icon}
                              </Box>
                              <Typography
                                sx={{
                                  fontSize: "0.75rem",
                                  fontWeight: 500,
                                  color: currentStyle.text,
                                  lineHeight: 1.35,
                                  wordBreak: "break-word",
                                }}
                              >
                                {reasonItem.description}
                              </Typography>
                            </Box>
                          </Tooltip>
                        );
                      }

                      return (
                        <Typography sx={{ fontSize: "0.82rem", color: "#64748B" }}>
                          {call.endReason || "—"}
                        </Typography>
                      );
                    })()}
                  </TableCell>

                  {/* Started At */}
                  <TableCell sx={{ py: 2 }}>
                    <Typography sx={{ fontSize: "0.82rem", color: "#475569", fontFamily: "monospace" }}>
                      {formatDate(call.startedAt, true)}
                    </Typography>
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="right" sx={{ py: 2, pr: 3 }}>
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
                      {/* Nút Xem chi tiết */}
                      <Tooltip title="View details call" arrow>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetail(call);
                          }}
                          sx={{
                            color: "#64748B",
                            p: 0.75,
                            borderRadius: "8px",
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

      {/* Pagination đồng bộ hoàn toàn với UserTable */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 25]}
        component="div"
        count={total}
        rowsPerPage={limit}
        page={page - 1}
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
