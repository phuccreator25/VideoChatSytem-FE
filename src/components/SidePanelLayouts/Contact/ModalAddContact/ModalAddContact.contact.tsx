import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import type { RootState } from "../../../../redux/store";
import type {
  AddContactData,
  UserOption,
} from "../../../../types/invitation/invitation.form.type";
import type { AddContactModalGroup } from "../../../../types/invitation/invitation.ui.type";
import type { RelationStatus } from "../../../../types/invitation/invitation.model.type";
import UserSearchOptions from "./UserSearchOptions.contact.tsx";
import Zoom from "@mui/material/Zoom";

type AddContactModalProps = {
  addContactModal: AddContactModalGroup;
};

const ModalAddContactModal: React.FC<AddContactModalProps> = ({
  addContactModal,
}) => {
  const { ui, handlers } = addContactModal;

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

  const selectedUser = watch("selectedUser");
  const selectedStatus = selectedUser?.statusInvitation || "none";

  useEffect(() => {
    if (!ui.open) return;

    const searchValue = searchKeyword.trim();

    if (!searchValue) {
      setOptions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const mappedOptions = await handlers.handleSearchUser(searchValue);

        setOptions(mappedOptions);
      } catch (error) {
        console.error("Search user failed:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchKeyword, ui.open, handlers.handleSearchUser]);

  const handleClose = () => {
    reset({
      selectedUser: null,
      invitationMessage: `Xin chào, tôi là ${user?.fullname ?? ""}`,
    });
    setSearchKeyword("");
    setOptions([]);
    handlers.setActionLoadingId(null);
    handlers.onClose();
  };

  const updateOptionStatus = (
    invitationId: string,
    nextStatus: RelationStatus
  ) => {
    setOptions((prev) =>
      prev.map((item) =>
        item.invitationId === invitationId
          ? { ...item, statusInvitation: nextStatus }
          : item
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

  const handleQuickAction = (
    event: React.SyntheticEvent,
    option: UserOption,
    action: "accept" | "decline" | "cancel"
  ) => {
    handlers.handleQuickAction(action, {
      event,
      option,
      onUpdateOptionStatus: updateOptionStatus,
    });
  };

  const submitLabel = () => {
    if (!selectedUser) return "Invite Contact";
    if (selectedStatus === "accepted") return "Already Friends";
    if (selectedStatus === "pending_sent") return "Invitation Sent";
    if (selectedStatus === "pending_received") return "Respond Above";
    return "Invite Contact";
  };

  const isSubmitDisabled = () => {
    return !selectedUser || selectedStatus !== "none";
  };

  const onAddContact = async (data: AddContactData) => {
    if (!data.selectedUser || data.selectedUser.statusInvitation !== "none") {
      return;
    }

    const res = await handlers.onSubmit({
      userId: data.selectedUser.id,
      invitationMessage: data.invitationMessage,
    });

    if (res) handleClose();
  };

  return (
    <Dialog
      open={ui.open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Zoom}
      transitionDuration={250}
      PaperProps={{
        sx: {
          borderRadius: "24px",
          backgroundColor: "#ffffff",
          border: "1px solid rgba(148, 163, 184, 0.15)",
          boxShadow: "none",
          overflow: "hidden",
          width: 560,
          maxWidth: "95vw",
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3.5,
          pt: 3.5,
          pb: 2,
          fontSize: 20,
          fontWeight: 800,
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          borderBottom: "1px solid rgba(148, 163, 184, 0.08)",
          position: "relative",
        }}
      >
        Add Contact
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            position: "absolute",
            right: 16,
            top: 20,
            color: "#64748b",
            bgcolor: "rgba(148, 163, 184, 0.08)",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "rgba(148, 163, 184, 0.16)",
              transform: "rotate(90deg)",
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onAddContact)}>
        <DialogContent sx={{ px: 3.5, py: 3.5 }}>
          <Stack spacing={3.5}>
            <Box>
              <Typography
                sx={{
                  mb: 1.2,
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: "#475569",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
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
                    onInputChange={(_, newInputValue) =>
                      setSearchKeyword(newInputValue)
                    }
                    getOptionLabel={(option) =>
                      option ? `${option.fullname} (${option.email})` : ""
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    noOptionsText={
                      searchKeyword.trim()
                        ? "Không tìm thấy user"
                        : "Nhập tên hoặc email để tìm"
                    }
                    ListboxProps={{
                      sx: {
                        maxHeight: 320,
                        overflowY: "auto",
                        p: 1,
                        borderRadius: "14px",
                        border: "1px solid rgba(148, 163, 184, 0.12)",
                        boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
                      },
                    }}
                    renderOption={(props, option) => {
                      const isActionLoading =
                        ui.actionLoadingId === option.invitationId;

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
                            borderRadius: "10px",
                            transition: "all 0.18s ease",
                            "&:not(:last-child)": {
                              mb: 0.5,
                            },
                          }}
                        >
                          <UserSearchOptions
                            option={option}
                            isActionLoading={isActionLoading}
                            handleQuickAction={handleQuickAction}
                          />
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
                            borderRadius: "14px",
                            backgroundColor: "rgba(248, 250, 252, 0.8)",
                            fontSize: 14.5,
                            px: 2,
                            transition: "all 0.2s ease",
                            "& fieldset": {
                              borderColor: "rgba(148, 163, 184, 0.2)",
                            },
                            "&:hover fieldset": {
                              borderColor: "rgba(111, 99, 246, 0.4)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#4f46e5",
                              borderWidth: "2px",
                            },
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
                  mb: 1.2,
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: "#475569",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
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
                        borderRadius: "14px",
                        backgroundColor: "rgba(248, 250, 252, 0.8)",
                        fontSize: 14.5,
                        alignItems: "flex-start",
                        p: 2,
                        transition: "all 0.2s ease",
                        "& fieldset": {
                          borderColor: "rgba(148, 163, 184, 0.2)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(111, 99, 246, 0.4)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#4f46e5",
                          borderWidth: "2px",
                        },
                      },
                    }}
                  />
                )}
              />
            </Box>

            {selectedUser && (
              <Box
                sx={{
                  px: 2,
                  py: 1.6,
                  borderRadius: "14px",
                  bgcolor: "rgba(111, 99, 246, 0.04)",
                  border: "1px solid rgba(111, 99, 246, 0.1)",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13.5,
                    color: "#4f46e5",
                    fontWeight: 500,
                    lineHeight: 1.5,
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
            px: 3.5,
            py: 2.5,
            borderTop: "1px solid rgba(148, 163, 184, 0.08)",
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            bgcolor: "rgba(248, 250, 252, 0.4)",
          }}
        >
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{
              minWidth: 92,
              height: 38,
              textTransform: "none",
              fontSize: 14.5,
              fontWeight: 700,
              color: "#475569",
              backgroundColor: "#f1f5f9",
              boxShadow: "none",
              borderRadius: "12px",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "#e2e8f0",
                color: "#1e293b",
                boxShadow: "none",
                transform: "translateY(-1px)",
              },
            }}
          >
            Close
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitDisabled()}
            sx={{
              minWidth: 120,
              height: 38,
              textTransform: "none",
              fontSize: 14.5,
              fontWeight: 700,
              color: "#ffffff",
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              boxShadow: "0 6px 16px rgba(79, 70, 229, 0.22)",
              borderRadius: "12px",
              transition: "all 0.2s ease",
              "&:hover": {
                background: "linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)",
                boxShadow: "0 8px 20px rgba(79, 70, 229, 0.32)",
                transform: "translateY(-1px)",
              },
            }}
          >
            {submitLabel()}
          </Button>
        </Box>
      </form>
    </Dialog>
  );
};

export default ModalAddContactModal;
