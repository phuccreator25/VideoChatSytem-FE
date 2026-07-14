import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import type {
  EditableFieldKey,
  ProfileData,
} from "../../../../types/profile/profile.model.type";
import { InfoRow } from "./InfoRow.profile";
import { useForm } from "react-hook-form";

type AboutSectionProps = {
    profile: ProfileData | null;
    expanded: boolean;
    onChange: (_event: any, isExpanded: boolean) => void;
    onUpdate: (payload: object) => void;
};

type ChangePasswordForm = {
    currentPass: string;
    password: string;
    confirmPass: string;
};

export function AboutSection({
    profile,
    onUpdate
}: AboutSectionProps) {
    const [editingField, setEditingField] = useState<EditableFieldKey | null>(null);
    const [editValue, setEditValue] = useState("");
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordForm>({
        defaultValues: {
            currentPass: "",
            password: "",
            confirmPass: ""
        }
    });

    const password = watch("password");

    const handleStartEdit = (field: EditableFieldKey, value: string) => {
        setEditingField(field);
        setEditValue(value);
    };

    const handleCancelEdit = () => {
        setEditingField(null);
        setEditValue("");
    };

    const handleSaveEdit = async () => {
        try {
            if (!editingField) return;

            const payload = {
                [editingField]: editValue
            };

            await onUpdate(payload);

            setEditingField(null);
            setEditValue("");
        } catch (error: any) {
            console.log(
                "Error update profile data:",
                error?.response?.data?.message || error?.message
            );
        }
    };

    const handleClosePasswordModal = () => {
        setOpenPasswordModal(false);
        reset();
    };

    const handleSubmitPassword = async (payload: ChangePasswordForm) => {
        try {
            setLoading(true);
            await onUpdate(payload);
            handleClosePasswordModal();
        } catch (error: any) {
            console.log(
                "Error update profile data:",
                error?.response?.data?.message || error?.message
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Box
                sx={{
                    mb: 1.5,
                    border: "1px solid rgba(148, 163, 184, 0.15)",
                    borderRadius: "16px",
                    overflow: "hidden",
                    bgcolor: "#ffffff",
                    boxShadow: "0 8px 32px rgba(15, 23, 42, 0.02)",
                }}
            >
                <Box
                    sx={{
                        minHeight: 52,
                        px: 2.5,
                        display: "flex",
                        alignItems: "center",
                        borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
                        bgcolor: "rgba(248, 250, 252, 0.5)",
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={1.25}>
                        <PersonOutlineRoundedIcon sx={{ fontSize: 20, color: "#4f46e5" }} />
                        <Typography
                            sx={{
                                fontSize: 15,
                                fontWeight: 700,
                                color: "#0f172a",
                            }}
                        >
                            About
                        </Typography>
                    </Stack>
                </Box>

                <Box
                    sx={{
                        px: 2.5,
                        pb: 2.5,
                        pt: 1.5,
                        bgcolor: "#ffffff",
                    }}
                >
                    <InfoRow
                        label="Full name"
                        fieldKey="fullname"
                        value={profile?.fullname}
                        editingField={editingField}
                        editValue={editValue}
                        onStartEdit={handleStartEdit}
                        onChangeEdit={setEditValue}
                        onSaveEdit={handleSaveEdit}
                        onCancelEdit={handleCancelEdit}
                    />

                    <InfoRow
                        label="Username"
                        fieldKey="username"
                        value={profile?.username}
                        editingField={editingField}
                        editValue={editValue}
                        onStartEdit={handleStartEdit}
                        onChangeEdit={setEditValue}
                        onSaveEdit={handleSaveEdit}
                        onCancelEdit={handleCancelEdit}
                    />

                    <InfoRow
                        label="Email"
                        value={profile?.email}
                        editingField={editingField}
                        editValue={editValue}
                        readOnly
                    />

                    <Box sx={{ pt: 2 }}>
                        <Button
                            onClick={() => setOpenPasswordModal(true)}
                            startIcon={<LockResetRoundedIcon />}
                            variant="outlined"
                            sx={{
                                borderRadius: "10px",
                                px: 2,
                                py: 1,
                                textTransform: "none",
                                fontWeight: 700,
                                borderColor: "rgba(79, 70, 229, 0.25)",
                                color: "#4f46e5",
                                "&:hover": {
                                    borderColor: "#4f46e5",
                                    bgcolor: "rgba(79, 70, 229, 0.06)",
                                },
                            }}
                        >
                            Change Password
                        </Button>
                    </Box>
                </Box>
            </Box>

            <Dialog
                open={openPasswordModal}
                onClose={handleClosePasswordModal}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    sx: {
                        borderRadius: "16px",
                        p: 0.5,
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#0f172a",
                        pr: 6,
                    }}
                >
                    Change Password
                    <IconButton
                        onClick={handleClosePasswordModal}
                        sx={{
                            position: "absolute",
                            right: 12,
                            top: 12,
                            color: "#64748b",
                        }}
                    >
                        <CloseRoundedIcon />
                    </IconButton>
                </DialogTitle>

                <form onSubmit={handleSubmit(handleSubmitPassword)}>
                    <DialogContent sx={{ pt: '8px !important' }}>
                        <Stack spacing={2}>
                            <TextField
                                label="Current password"
                                type="password"
                                fullWidth
                                {...register("currentPass", {
                                    required: "Please enter your current password",
                                })}
                                error={!!errors.currentPass}
                                helperText={errors.currentPass?.message}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: "10px",
                                    },
                                }}
                            />

                            <TextField
                                label="New password"
                                type="password"
                                fullWidth
                                {...register("password", {
                                    required: "Please enter a new password",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters",
                                    },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
                                        message: "Password must include uppercase, lowercase, numbers, and special characters",
                                    },
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: "10px",
                                    },
                                }}
                            />

                            <TextField
                                label="Confirm new password"
                                type="password"
                                fullWidth
                                {...register("confirmPass", {
                                    required: "Please confirm your password",
                                    validate: (value) =>
                                        value === password || "Passwords do not match",
                                })}
                                error={!!errors.confirmPass}
                                helperText={errors.confirmPass?.message}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: "10px",
                                    },
                                }}
                            />
                        </Stack>
                    </DialogContent>

                    <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
                        <Button
                            type="button"
                            onClick={handleClosePasswordModal}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 700,
                                color: '#64748b',
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            sx={{
                                borderRadius: "10px",
                                px: 2,
                                textTransform: 'none',
                                fontWeight: 700,
                                boxShadow: 'none',
                                bgcolor: '#4f46e5',
                                '&:hover': {
                                    boxShadow: 'none',
                                    bgcolor: '#4338ca',
                                },
                            }}
                        >
                            Update
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}
