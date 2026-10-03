import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Typography,
  IconButton,
  TablePagination,
  Paper,
  Tooltip,
  Skeleton,
} from "@mui/material";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { UserStatusBadge } from "./UserStatusBadge";
import type { AdminUserItem } from "../../../types/admin/userAdmin.type";
import { formatDate } from "../../../helpers/formatDate.helper";
import { useSearchParams } from "react-router-dom";
import { roleLabel } from "../../../data/user.data";
import { maskEmail } from "../../../helpers/admin/userAdmin.helper";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";

type UserTableProps = {
  users: AdminUserItem[];
  onViewDetail: (user: AdminUserItem) => void;
  onBanUser: (user: AdminUserItem) => void;
  onUnbanUser: (user: AdminUserItem) => void;
  onResendVerification: (id: string) => void;
  onUpdateAdmin?: (user: AdminUserItem) => void;
  loading: boolean;
  page: number;
  pagination: {total: number,totalPages: number },
  limit: number;
  isSendMailing: { [key: string]: boolean }
};

export const UserTable = ({
  users,
  onViewDetail,
  onBanUser,
  onUnbanUser,
  onResendVerification,
  onUpdateAdmin,
  loading,
  page,
  pagination,
  limit,
  isSendMailing
}: UserTableProps) => {

  const [searchParams,setSearchParams] = useSearchParams();
  const currentAdmin = useSelector((state:RootState) => state.admin.currentAdmin);
  
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
        <Table sx={{ minWidth: 900 }}>
          <TableHead sx={{ bgcolor: "#FAFAFA", borderBottom: "1px solid #F1F5F9" }}>
            <TableRow>
              <TableCell sx={{ py: 1.5, fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                User / Customer
              </TableCell>
              <TableCell sx={{ py: 1.5, fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Email (Masked)
              </TableCell>
              <TableCell sx={{ py: 1.5, fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Role
              </TableCell>
              <TableCell sx={{ py: 1.5, fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Live Status
              </TableCell>
              <TableCell sx={{ py: 1.5, fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Verification
              </TableCell>
              <TableCell sx={{ py: 1.5, fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Account State
              </TableCell>
              <TableCell sx={{ py: 1.5, fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Last Active
              </TableCell>
              <TableCell sx={{ py: 1.5, fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Joined Date
              </TableCell>
              <TableCell align="right" sx={{ py: 1.5, fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <TableRow key={`skeleton-row-${index}`} sx={{ borderBottom: "1px solid #F1F5F9" }}>
                  {/* User / Customer */}
                  <TableCell sx={{ py: 1.75 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Skeleton variant="circular" width={38} height={38} />
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        <Skeleton variant="text" width={110} height={18} />
                        <Skeleton variant="text" width={75} height={14} />
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Email */}
                  <TableCell sx={{ py: 1.75 }}>
                    <Skeleton variant="text" width={130} height={18} />
                  </TableCell>

                  {/* Role */}
                  <TableCell sx={{ py: 1.75 }}>
                    <Skeleton variant="rounded" width={64} height={24} sx={{ borderRadius: "8px" }} />
                  </TableCell>

                  {/* Live Status */}
                  <TableCell sx={{ py: 1.75 }}>
                    <Skeleton variant="rounded" width={68} height={24} sx={{ borderRadius: "8px" }} />
                  </TableCell>

                  {/* Verification */}
                  <TableCell sx={{ py: 1.75 }}>
                    <Skeleton variant="rounded" width={68} height={24} sx={{ borderRadius: "8px" }} />
                  </TableCell>

                  {/* Account State */}
                  <TableCell sx={{ py: 1.75 }}>
                    <Skeleton variant="rounded" width={68} height={24} sx={{ borderRadius: "8px" }} />
                  </TableCell>

                  {/* Last Active */}
                  <TableCell sx={{ py: 1.75 }}>
                    <Skeleton variant="text" width={85} height={18} />
                  </TableCell>

                  {/* Joined Date */}
                  <TableCell sx={{ py: 1.75 }}>
                    <Skeleton variant="text" width={85} height={18} />
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="right" sx={{ py: 1.75 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 0.5 }}>
                      <Skeleton variant="circular" width={28} height={28} />
                      <Skeleton variant="circular" width={28} height={28} />
                      <Skeleton variant="circular" width={28} height={28} />
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                  <Typography variant="body2" sx={{ color: "#94A3B8", fontWeight: 500 }}>
                    No users match the selected filters.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user._id}
                  hover
                  onClick={() => onViewDetail(user)}
                  sx={{
                    cursor: "pointer",
                    transition: "background-color 0.15s ease",
                    "&:hover": { bgcolor: "#F8FAFC !important" },
                    borderBottom: "1px solid #F1F5F9",
                  }}
                >
                  {/* User Fullname + Username + Avatar */}
                  <TableCell sx={{ py: 1.75 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar
                        src={user.avatar || undefined}
                        sx={{
                          width: 38,
                          height: 38,
                          color: "#FFFFFF",
                          fontSize: "0.875rem",
                          fontWeight: 700,
                        }}
                      >
                        {user.fullname?.charAt(0)?.toUpperCase() || "U"}
                      </Avatar>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#0F172A", fontSize: "0.875rem" }}
                        >
                          {user.fullname}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "#64748B", fontSize: "0.75rem" }}
                        >
                          {user.username ? `@${user.username}` : "No username"}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Masked Email */}
                  <TableCell sx={{ py: 1.75 }}>
                    <Typography variant="body2" sx={{ color: "#475569", fontSize: "0.85rem", fontFamily: "monospace" }}>
                      {maskEmail(user.email)}
                    </Typography>
                  </TableCell>

                  {/* Role */}
                  <TableCell sx={{ py: 1.75 }}>
                    <UserStatusBadge
                      variant={(user.role || "client").toLowerCase() as any}
                      label={roleLabel[user.role || "client"] || user.role}
                    />
                  </TableCell>

                  {/* Live Status (Online/Offline) */}
                  <TableCell sx={{ py: 1.75 }}>
                    <UserStatusBadge
                      variant={user.isOnline ? "online" : "offline"}
                    />
                  </TableCell>

                  {/* Email Verification */}
                  <TableCell sx={{ py: 1.75 }}>
                    <UserStatusBadge
                      variant={user.isActive ? "active" : "pending"}
                      label={user.isActive ? "Active" : "Pending"}
                    />
                  </TableCell>

                  {/* Ban Status */}
                  <TableCell sx={{ py: 1.75 }}>
                    <UserStatusBadge
                      variant={user.isBanned ? "banned" : "normal"}
                      label={user.isBanned ? "Banned" : "Normal"}
                    />
                  </TableCell>

                  {/* Last Seen */}
                  <TableCell sx={{ py: 1.75 }}>
                    <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.825rem" }}>
                      {formatDate(user.lastSeenAt)}
                    </Typography>
                  </TableCell>

                  {/* Created At */}
                  <TableCell sx={{ py: 1.75 }}>
                    <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.825rem" }}>
                      {formatDate(user.createdAt)}
                    </Typography>
                  </TableCell>

                  {/* Direct Action Icon Buttons */}
                  <TableCell align="right" sx={{ py: 1.75 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 0.5,
                      }}
                    >
                      {/* View Detail Button */}
                      <Tooltip title="View Details" arrow>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetail(user);
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

                      {/* Edit Admin Button (only for ADMIN role) */}
                      {user.role?.toLowerCase() !== "client" && onUpdateAdmin && (
                        <Tooltip title="Update Admin Account" arrow>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdateAdmin(user);
                            }}
                            sx={{
                              color: "#7C3AED",
                              p: 0.75,
                              borderRadius: "8px",
                              "&:hover": {
                                color: "#6D28D9",
                                bgcolor: "rgba(124, 58, 237, 0.12)",
                              },
                            }}
                          >
                            <EditRoundedIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      )}

                      {/* Resend Verification Button (only shown if user is not active) */}
                      {!user.isActive && (
                        <Tooltip title="Resend Verification Email" arrow>
                          <IconButton
                            size="small"
                            disabled={isSendMailing?.[user._id]}
                            onClick={(e) => {
                              if(!user) return;
                              e.stopPropagation();
                              onResendVerification(user._id);
                            }}
                            sx={{
                              color: "#D97706",
                              p: 0.75,
                              borderRadius: "8px",
                              "&:hover": {
                                color: "#B45309",
                                bgcolor: "#FEF3C7",
                              },
                            }}
                          >
                            <MarkEmailReadRoundedIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      )}

                      {/* Ban / Unban Button */}
                      {(user.role?.toLowerCase() !== "supper_admin" && user._id !== currentAdmin?._id) && (
                        user.isBanned ? (
                          <Tooltip title="Unban User" arrow>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                onUnbanUser(user);
                              }}
                              sx={{
                                color: "#059669",
                                p: 0.75,
                                borderRadius: "8px",
                                "&:hover": {
                                  color: "#047857",
                                  bgcolor: "#DCFCE7",
                                },
                              }}
                            >
                              <LockOpenRoundedIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Ban User" arrow>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                onBanUser(user);
                              }}
                              sx={{
                                color: "#DC2626",
                                p: 0.75,
                                borderRadius: "8px",
                                "&:hover": {
                                  color: "#B91C1C",
                                  bgcolor: "#FEE2E2",
                                },
                              }}
                            >
                              <BlockRoundedIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        )
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={pagination.total}
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
