import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import InputBase from "@mui/material/InputBase";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../../redux/store";
import { openCallModal } from "../../../../redux/call.redux";
import { onHandleBlockUser, onHandleUnBlockUser } from "../../../../redux/block.redux";
import { getLastSeenText } from "../../../../helpers/formatLastSeenAt.helper";
import type { ConversationUserInfo } from "../../../../types/chat/chat.conversation.type";

const MOCK_MUTUAL_GROUPS = [
  { id: 1, name: "Design Team - UI/UX", members: 12, avatarBg: "linear-gradient(135deg, #a5b4fc 0%, #6366f1 100%)", short: "DT" },
  { id: 2, name: "Project VideoChat", members: 8, avatarBg: "linear-gradient(135deg, #c7d2fe 0%, #3b82f6 100%)", short: "VC" },
  { id: 3, name: "Chill Out & Coffee", members: 24, avatarBg: "linear-gradient(135deg, #fbcfe8 0%, #db2777 100%)", short: "CC" },
];

const actionButtonSx = {
  width: 44,
  height: 44,
  borderRadius: "50%",
  color: "#64748b",
  backgroundColor: "rgba(241, 245, 249, 0.8)",
  border: "1px solid rgba(148, 163, 184, 0.15)",
  transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
  "&:hover": {
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    borderColor: "#4f46e5",
    transform: "scale(1.12) translateY(-2px)",
    boxShadow: "0 8px 16px rgba(79, 70, 229, 0.28)",
  },
};

export function ProfileTopBar({ onClose }: { onClose: () => void }) {
  return (
    <Box
      sx={{
        p: 2.5,
        borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a", fontSize: "16px" }}>
        Conversation Details
      </Typography>
      <IconButton
        size="small"
        onClick={onClose}
        sx={{
          color: "#64748b",
          bgcolor: "rgba(0,0,0,0.03)",
          "&:hover": { bgcolor: "rgba(239, 68, 68, 0.1)", color: "#ef4444" },
          transition: "all 0.2s ease",
        }}
      >
        <CloseRoundedIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );
}

type ProfileHeaderProps = {
  userData: ConversationUserInfo | null;
  displayName: string;
  isEditingNickname: boolean;
  nicknameInput: string | null;
  isBlocked: boolean;
  isMeBlocked: boolean;
  onOpenAvatarPreview: () => void;
  onSetIsEditingNickname: (val: boolean) => void;
  onSetNicknameInput: (val: string) => void;
  onUpdateNickName: () => void;
  onOpenDeleteDialog: () => void;
};

export function ProfileHeader({
  userData,
  displayName,
  isEditingNickname,
  nicknameInput,
  isBlocked,
  isMeBlocked,
  onOpenAvatarPreview,
  onSetIsEditingNickname,
  onSetNicknameInput,
  onUpdateNickName,
  onOpenDeleteDialog,
}: ProfileHeaderProps) {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      {/* User Card Profile Cover & Avatar */}
      <Box
        sx={{
          position: "relative",
          borderRadius: 5,
          bgcolor: "rgba(255, 255, 255, 0.45)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
          pb: 2.5,
        }}
      >
        {/* Cover Photo */}
        <Box
          sx={{
            height: 95,
            background: "linear-gradient(224deg, #e0c3fc 0%, #8ec5fc 100%)",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
          }}
        />

        {/* Avatar placement */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: -5.5 }}>
          <Avatar
            src={userData?.avatar}
            alt={displayName}
            onClick={onOpenAvatarPreview}
            sx={{
              width: 86,
              height: 86,
              border: "4px solid rgba(255, 255, 255, 0.95)",
              boxShadow: "0 12px 28px -8px rgba(79, 70, 229, 0.25)",
              bgcolor: "#4f46e5",
              fontSize: 28,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                transform: "scale(1.08)",
                boxShadow: "0 14px 32px -6px rgba(79, 70, 229, 0.35)",
              },
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </Avatar>
        </Box>

        {/* Name & Active Status */}
        <Box sx={{ textAlign: "center", mt: 1.5, px: 2 }}>
          {isEditingNickname ? (
            <Box
              sx={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                mb: 0.5,
              }}
            >
              <InputBase
                value={nicknameInput}
                onChange={(e) => onSetNicknameInput(e.target.value)}
                autoFocus
                placeholder="Enter nickname..."
                sx={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#0f172a",
                  borderBottom: "2px solid #4f46e5",
                  px: 0.5,
                  pb: 0.25,
                  width: "150px",
                  "& input": {
                    textAlign: "center",
                  },
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onSetIsEditingNickname(false);
                    onUpdateNickName();
                  } else if (e.key === "Escape") {
                    onSetNicknameInput(userData?.nickname ?? userData?.fullname ?? "");
                    onSetIsEditingNickname(false);
                  }
                }}
              />
              <Stack
                direction="row"
                spacing={0.5}
                sx={{
                  position: "absolute",
                  right: 4,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => {
                    onSetIsEditingNickname(false);
                    onUpdateNickName();
                  }}
                  sx={{
                    bgcolor: "rgba(34, 197, 94, 0.1)",
                    color: "#22c55e",
                    "&:hover": { bgcolor: "rgba(34, 197, 94, 0.2)" },
                    width: 24,
                    height: 24,
                  }}
                >
                  <CheckRoundedIcon sx={{ fontSize: 14 }} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => {
                    onSetNicknameInput(userData?.nickname ?? userData?.fullname ?? "");
                    onSetIsEditingNickname(false);
                  }}
                  sx={{
                    bgcolor: "rgba(239, 68, 68, 0.1)",
                    color: "#ef4444",
                    "&:hover": { bgcolor: "rgba(239, 68, 68, 0.2)" },
                    width: 24,
                    height: 24,
                  }}
                >
                  <CloseRoundedIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Stack>
            </Box>
          ) : (
            <Box
              sx={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 0.5,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a", fontSize: 17, letterSpacing: "-0.2px" }}>
                {displayName}
              </Typography>
              <Tooltip title="Edit nickname" arrow>
                <IconButton
                  size="small"
                  onClick={() => {
                    onSetNicknameInput(userData?.nickname ?? userData?.fullname ?? "");
                    onSetIsEditingNickname(true);
                  }}
                  sx={{
                    position: "absolute",
                    right: -32,
                    color: "#94a3b8",
                    p: 0.5,
                    "&:hover": { color: "#4f46e5", bgcolor: "rgba(79, 70, 229, 0.05)" },
                    transition: "all 0.2s ease",
                  }}
                >
                  <EditOutlinedIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          <Stack direction="row" spacing={0.75} justifyContent="center" alignItems="center" sx={{ mt: 0.5 }}>
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                bgcolor: userData?.isOnline === "online" ? "#22c55e" : "#94a3b8",
                boxShadow: userData?.isOnline === "online" ? "0 0 10px #22c55e" : "none",
                flexShrink: 0,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: userData?.isOnline === "online" ? "#16a34a" : "#64748b",
                fontWeight: 700,
                fontSize: "11px",
                display: "inline-block",
                lineHeight: 1.4,
              }}
            >
              {userData?.isOnline === 'online' ? "Active now" : getLastSeenText(userData?.lastSeenAt)}
            </Typography>
          </Stack>
        </Box>
      </Box>

      {/* Quick Actions Panel */}
      <Stack direction="row" spacing={1.75} justifyContent="center">
        <Tooltip title="Audio Call" arrow>
          <IconButton disabled={isBlocked || isMeBlocked} sx={actionButtonSx} onClick={() => dispatch(openCallModal({ type: "voice" }))}>
            <CallOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Video Call" arrow>
          <IconButton disabled={isBlocked || isMeBlocked} sx={actionButtonSx} onClick={() => dispatch(openCallModal({ type: "video" }))}>
            <VideocamOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title={isBlocked ? "Unblock User" : "Block User"} arrow>
          <IconButton
            sx={{
              ...actionButtonSx,
              "&:hover": {
                backgroundColor: isBlocked ? "#16a34a" : "#ef4444",
                color: "#ffffff",
                borderColor: isBlocked ? "#16a34a" : "#ef4444",
                transform: "scale(1.12) translateY(-2px)",
                boxShadow: isBlocked ? "0 8px 16px rgba(22, 163, 74, 0.28)" : "0 8px 16px rgba(239, 68, 68, 0.28)",
              },
            }}
            onClick={() => {
              if (!userData?.userId) return;
              if (isBlocked) {
                dispatch(onHandleUnBlockUser(userData?.userId));
              } else {
                dispatch(onHandleBlockUser(userData?.userId));
              }
            }}
          >
            {isBlocked ? <LockOpenOutlinedIcon sx={{ fontSize: 18 }} /> : <BlockOutlinedIcon sx={{ fontSize: 18 }} />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Conversation" arrow>
          <IconButton
            onClick={onOpenDeleteDialog}
            sx={{
              ...actionButtonSx,
              "&:hover": {
                backgroundColor: "#ef4444",
                color: "#ffffff",
                borderColor: "#ef4444",
                transform: "scale(1.12) translateY(-2px)",
                boxShadow: "0 8px 16px rgba(239, 68, 68, 0.28)",
              },
            }}
          >
            <DeleteRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Mutual Groups Card */}
      <Paper
        elevation={0}
        sx={{
          p: 2.25,
          borderRadius: 4.5,
          bgcolor: "rgba(255, 255, 255, 0.45)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.01)",
          textAlign: "left",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 800,
            color: "#64748b",
            fontSize: 10.5,
            textTransform: "uppercase",
            letterSpacing: 1,
            display: "block",
            mb: 2,
            textAlign: "left",
          }}
        >
          Mutual Groups
        </Typography>

        <Stack spacing={1.75}>
          {MOCK_MUTUAL_GROUPS.map((group) => (
            <Stack key={group.id} direction="row" spacing={1.5} alignItems="center">
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: "12px",
                  fontWeight: 700,
                  background: group.avatarBg,
                  color: "#ffffff",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                }}
              >
                {group.short}
              </Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: "#334155",
                    fontSize: "13px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "block",
                  }}
                >
                  {group.name}
                </Typography>
                <Typography variant="caption" sx={{ color: "#94a3b8", display: "block", fontSize: "11px", fontWeight: 500 }}>
                  {group.members} members
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Paper>
    </>
  );
}
