import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import userApi from "../../../../api/User.api";
import type { RootState } from "../../../../redux/store";
import { enqueueSnackbar } from "notistack";
import type { AddContactData, AddContactModalProps, UserOption, RelationStatus } from "../../../../types/Invitation.tsx";

const AddContactModal: React.FC<AddContactModalProps> = ({
  open,
  onClose,
  onSubmit,
  onAcceptRequest,
  onDeclineRequest,
  onCancelInvitation,
}) => {
  const user = useSelector((state: RootState) => state.user.currentUser);

  const {
    control,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AddContactData>({
    defaultValues: {
      selectedUser: null,
      invitationMessage: `Xin chào, tôi là ${user?.fullname ?? ""}`,
    },
  });

  const [searchKeyword, setSearchKeyword] = useState("");
  const [options, setOptions] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null); //Id Item hiển thị Status

  const selectedUser = watch("selectedUser");
  const selectedStatus = selectedUser?.statusInvitation || "none";

  useEffect(() => {
    if (!open) return;

    const searchValue = searchKeyword.trim();

    if (!searchValue) {
      setOptions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await userApi.onSearchUser(searchValue);

        const mappedOptions: UserOption[] = (res?.data?.data || []).map((item: any) => ({
          id: item._id,
          fullname: item.fullname,
          email: item.email,
          avatar: item.avatar || "",
          statusInvitation: item.relationStatus || "none",
          invitationId: item.invitationId
        }));

        setOptions(mappedOptions);
      } catch (error) {
        console.error("Search user failed:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchKeyword, open]);

  const handleClose = () => {
    reset({
      selectedUser: null,
      invitationMessage: `Xin chào, tôi là ${user?.fullname ?? ""}`,
    });
    setSearchKeyword("");
    setOptions([]);
    setActionLoadingId(null);
    onClose();
  };

  //Cập nhật trạng thái khi click handleQuickAction
  const updateOptionStatus = (invitationId: string, nextStatus: RelationStatus) => {
    setOptions((prev) =>
      prev.map((item) =>
        item.invitationId === invitationId ? { ...item, statusInvitation: nextStatus } : item
      )
    );

    const currentSelected = watch("selectedUser");
    if (currentSelected?.invitationId === invitationId) {
      reset({
        selectedUser: { ...currentSelected, statusInvitation: nextStatus },
        invitationMessage: watch("invitationMessage"),
      });
    }
  };

  const handleQuickAction = async (
    event: React.MouseEvent,
    option: UserOption,
    action: "accept" | "decline" | "cancel"
  ) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      setActionLoadingId(option.invitationId);

      if (action === "accept") {
        const result = await onAcceptRequest?.(option.invitationId);
        if (result) {
          updateOptionStatus(option.invitationId, "accepted");
          enqueueSnackbar("Đã chấp nhận lời mời thành công", {
            variant: "success"
          })
        }
        return;
      }

      if (action === "decline") {
        const result = await onDeclineRequest?.(option.invitationId);
        if (result) {
          updateOptionStatus(option.invitationId, "none");
          enqueueSnackbar("Đã từ chối lời mời thành công", {
            variant: "success"
          })
        }
        return;
      }

      if (action === "cancel") {
        const result = await onCancelInvitation?.(option.invitationId);
        if (result) {
          enqueueSnackbar("Đã thu hồi lời mời thành công", {
            variant: "success"
          })
          updateOptionStatus(option.invitationId, "none");
        }
      }
    } catch (error) {
      console.error("Invitation action failed:", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  const submitLabel = () => { ///Set btn label
    if (!selectedUser) return "Invite Contact";
    if (selectedStatus === "accepted") return "Already Friends";
    if (selectedStatus === "pending_sent") return "Invitation Sent";
    if (selectedStatus === "pending_received") return "Respond Above";
    return "Invite Contact";
  };

  const isSubmitDisabled = () => { // Nếu đã là bạn bè hay đã gửi rồi thì khong có thao tác
    return !selectedUser || selectedStatus !== "none";
  };

  const onAddContact = async (data: AddContactData) => {
    if (!data.selectedUser || data.selectedUser.statusInvitation !== "none") return;

    await onSubmit?.({
      userId: data.selectedUser.id,
      invitationMessage: data.invitationMessage,
    });

    updateOptionStatus(data.selectedUser.id, "pending_sent");
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          width: 560,
          maxWidth: "95vw",
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          py: 2,
          fontSize: 17,
          fontWeight: 700,
          color: "#1f2430",
          borderBottom: "1px solid #ececf3",
          position: "relative",
        }}
      >
        Add Contact
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            color: "#7d8291",
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onAddContact)}>
        <DialogContent sx={{ px: 3, py: 3 }}>
          <Stack spacing={3}>
            <Box>
              <Typography
                sx={{
                  mb: 1,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#4b5160",
                }}
              >
                Find user
              </Typography>

              <Controller
                name="selectedUser"
                control={control}
                rules={{ required: "Vui lòng chọn user" }}
                render={({ field }) => (
                  <Autocomplete
                    options={options}
                    loading={loading}
                    value={field.value}
                    onChange={(_, newValue) => field.onChange(newValue)}
                    onInputChange={(_, newInputValue) => setSearchKeyword(newInputValue)}
                    getOptionLabel={(option) =>
                      option ? `${option.fullname} (${option.email})` : ""
                    }
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    noOptionsText={
                      searchKeyword.trim()
                        ? "Không tìm thấy user"
                        : "Nhập tên hoặc email để tìm"
                    }
                    ListboxProps={{
                      sx: {
                        maxHeight: 320,
                        overflowY: "auto",
                        p: 0.75,
                      },
                    }}
                    renderOption={(props, option) => {
                      const isActionLoading = actionLoadingId === option.id;

                      return (
                        <Box
                          component="li"
                          {...props}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            py: 1.2,
                            px: 1.2,
                            maxWidth: "100%",
                            borderRadius: 2,
                            "&:not(:last-child)": {
                              mb: 0.5,
                            },
                          }}
                        >
                          <Avatar
                            src={option.avatar}
                            alt={option.fullname}
                            sx={{ width: 38, height: 38, flexShrink: 0 }}
                          >
                            {option.fullname?.charAt(0)?.toUpperCase()}
                          </Avatar>

                          <Box sx={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
                            <Typography
                              sx={{
                                fontSize: 14,
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                color: "#1f2430",
                              }}
                            >
                              {option.fullname}
                            </Typography>

                            <Typography
                              sx={{
                                fontSize: 13,
                                color: "#6b7280",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {option.email}
                            </Typography>
                          </Box>

                          {isActionLoading ? (
                            <CircularProgress size={18} />
                          ) : option.statusInvitation === "pending_received" ? (
                            <Stack direction="row" spacing={0.5}>
                              <Tooltip title="Accept">
                                <IconButton
                                  size="small"
                                  onClick={(e) =>
                                    handleQuickAction(e, option, "accept")
                                  }
                                  sx={{
                                    width: 30,
                                    height: 30,
                                    bgcolor: "rgba(34, 197, 94, 0.12)",
                                    color: "#16a34a",
                                    "&:hover": {
                                      bgcolor: "rgba(34, 197, 94, 0.18)",
                                    },
                                  }}
                                >
                                  <CheckRoundedIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Decline">
                                <IconButton
                                  size="small"
                                  onClick={(e) =>
                                    handleQuickAction(e, option, "decline")
                                  }
                                  sx={{
                                    width: 30,
                                    height: 30,
                                    bgcolor: "rgba(239, 68, 68, 0.10)",
                                    color: "#dc2626",
                                    "&:hover": {
                                      bgcolor: "rgba(239, 68, 68, 0.16)",
                                    },
                                  }}
                                >
                                  <CloseRoundedIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          ) : option.statusInvitation === "pending_sent" ? (
                            <Tooltip title="Cancel invitation">
                              <IconButton
                                size="small"
                                onClick={(e) =>
                                  handleQuickAction(e, option, "cancel")
                                }
                                sx={{
                                  width: 30,
                                  height: 30,
                                  bgcolor: "rgba(245, 158, 11, 0.12)",
                                  color: "#d97706",
                                  "&:hover": {
                                    bgcolor: "rgba(245, 158, 11, 0.18)",
                                  },
                                }}
                              >
                                <CloseRoundedIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                          ) : option.statusInvitation === "accepted" ? (
                            <Tooltip title="Already friends">
                              <Box
                                sx={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  bgcolor: "rgba(34, 197, 94, 0.10)",
                                  color: "#16a34a",
                                  flexShrink: 0,
                                }}
                              >
                                <GroupRoundedIcon sx={{ fontSize: 18 }} />
                              </Box>
                            </Tooltip>
                          ) : null}
                        </Box>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Search by fullname or email"
                        error={!!errors.selectedUser}
                        helperText={errors.selectedUser?.message}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loading ? <CircularProgress size={18} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                          sx: {
                            minHeight: 46,
                            borderRadius: 2,
                            backgroundColor: "#fff",
                            fontSize: 14,
                          },
                        }}
                      />
                    )}
                  />
                )}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  mb: 1,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#4b5160",
                }}
              >
                Invitation message
              </Typography>

              <Controller
                name="invitationMessage"
                control={control}
                rules={{ required: "Vui lòng nhập lời mời" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    minRows={4}
                    placeholder="Write a short message"
                    error={!!errors.invitationMessage}
                    helperText={errors.invitationMessage?.message}
                    variant="outlined"
                    disabled={selectedStatus !== "none"}
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                        backgroundColor: "#fff",
                        fontSize: 14,
                        alignItems: "flex-start",
                      },
                    }}
                  />
                )}
              />
            </Box>

            {selectedUser && (
              <Box
                sx={{
                  px: 1.5,
                  py: 1.25,
                  borderRadius: 2,
                  bgcolor: "#f8f9fd",
                  border: "1px solid #edf0f5",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    color: "#667085",
                  }}
                >
                  {selectedStatus === "none" &&
                    "You can send a friend invitation to this user."}
                  {selectedStatus === "pending_sent" &&
                    "You have already sent an invitation to this user. Use the cancel icon in the list above if needed."}
                  {selectedStatus === "pending_received" &&
                    "This user has sent you a friend request. Use the accept or decline icons in the list above."}
                  {selectedStatus === "accepted" &&
                    "You and this user are already connected."}
                </Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>

        <Box
          sx={{
            px: 3,
            py: 2,
            borderTop: "1px solid #ececf3",
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
          }}
        >
          <Button onClick={handleClose} variant="text">
            Close
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitDisabled()}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: "none",
            }}
          >
            {submitLabel()}
          </Button>
        </Box>
      </form>
    </Dialog>
  );
};

export default AddContactModal;