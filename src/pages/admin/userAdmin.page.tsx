import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import { UserTable } from "../../components/admin/Users/UserTable";
import { UserFilters } from "../../components/admin/Users/UserFilters";
import { UserDetailModal } from "../../components/admin/Users/UserDetailModal";
import { UserBanModal } from "../../components/admin/Users/UserBanModal";
import { UserUnbanModal } from "../../components/admin/Users/UserUnbanModal";
import { UserCreateModal } from "../../components/admin/Users/UserCreateModal";
import { UserUpdateModal } from "../../components/admin/Users/UserUpdateModal";
import useUserAdmin from "../../hooks/admin/userAdmin.hook";
import type { AdminUserItem } from "../../types/admin/userAdmin.type";

export function UserAdminPage() {

  const {ui, data, handler} = useUserAdmin()

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Top Header & Add User Action */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.35rem", sm: "1.5rem" },
              letterSpacing: "-0.02em",
              color: "#0F172A",
            }}
          >
            User Management
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => handler.openModal("create", null)}
          startIcon={<PersonAddRoundedIcon sx={{ fontSize: 18 }} />}
          sx={{
            background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
            color: "#FFFFFF",
            boxShadow: "0 4px 12px rgba(124, 58, 237, 0.25)",
            px: 2.5,
            py: 1,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              background: "linear-gradient(135deg, #6D28D9 0%, #5B21B6 100%)",
            },
          }}
        >
          Create Admin
        </Button>
      </Box>


      {/* Filter Bar */}
      <UserFilters 
        filters={ui.query} 
        onFetchData={handler.fetchUsers}
      />

      {/* Main User Data Table */}
      <UserTable
        users={data.users}
        onViewDetail={(user: AdminUserItem) => handler.openModal("detail", user)}
        onBanUser={(user: AdminUserItem) => handler.openModal("ban", user)}
        onUnbanUser={(user: AdminUserItem) => handler.openModal("unban", user)}
        onResendVerification={handler.onSendMailVerify}
        onUpdateAdmin={(user: AdminUserItem) => handler.openModal("update", user)}
        loading={ui.loading}
        page={ui.page}
        pagination={data.pagination}
        limit={ui.limit}
        isSendMailing={ui.isSendMailing}
      />

      {/* Create Admin Modal */}
      <UserCreateModal
        open={ui.createOpen}
        onClose={() => handler.closeModal()}
        onCreateAdmin={handler.onCreateAdmin}
      />

      {/* Update Admin Modal */}
      <UserUpdateModal
        open={Boolean(ui.updateUser)}
        user={ui.updateUser}
        onClose={() => handler.closeModal()}
        onUpdateAdmin={handler.onUpdateAdmin}
      />

      {/* Detail Dialog */}
      <UserDetailModal
        user={ui.detailUser}
        open={Boolean(ui.detailUser)}
        onClose={() => handler.closeModal()}
        onOpenBan={(user: AdminUserItem) => {
          handler.closeModal();
          handler.openModal("ban", user);
        }}
        onOpenUnban={(user: AdminUserItem) => {
          handler.closeModal();
          handler.openModal("unban", user);
        }}
        onResendVerification={handler.onSendMailVerify}
        isSendMailing={ui.isSendMailing}
      />

      {/* Ban Confirmation Modal */}
      <UserBanModal
        user={ui.banUser}
        open={Boolean(ui.banUser)}
        onClose={() => handler.closeModal()}
        onConfirmBan={handler.onBanAdmin}
      />

      {/* Unban Confirmation Modal */}
      <UserUnbanModal
        user={ui.unbanUser}
        open={Boolean(ui.unbanUser)}
        onClose={() => handler.closeModal()}
        onConfirmUnban={handler.onUnbanAdmin}
      />
    </Box>
  );
}