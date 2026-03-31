import { useState, type Dispatch, type SetStateAction, type SyntheticEvent } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
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

import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import type { EditableFieldKey, ProfileData } from "../../../../types/data.type";
import { InfoRow } from "./InfoRow.profile";

type AboutSectionProps = {
    profile: ProfileData;
    setProfile: Dispatch<SetStateAction<ProfileData>>;
    expanded: boolean;
    onChange: (_event: SyntheticEvent, isExpanded: boolean) => void;
};

export function AboutSection({
    profile,
    setProfile,
    expanded,
    onChange,
}: AboutSectionProps) {
    const [editingField, setEditingField] = useState<EditableFieldKey | null>(null);
    const [editValue, setEditValue] = useState("");
    const [openPasswordModal, setOpenPasswordModal] = useState(false);

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    const handleStartEdit = (field: EditableFieldKey, value: string) => {
        setEditingField(field);
        setEditValue(value);
    };

    const handleCancelEdit = () => {
        setEditingField(null);
        setEditValue("");
    };

    const handleSaveEdit = () => {
        if (!editingField) return;

        setProfile((prev) => ({
            ...prev,
            [editingField]: editValue,
        }));

        setEditingField(null);
        setEditValue("");
    };

    const handleClosePasswordModal = () => {
        setOpenPasswordModal(false);
        setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        });
    };

    const handleSubmitPassword = () => {
        if (
            !passwordForm.currentPassword ||
            !passwordForm.newPassword ||
            !passwordForm.confirmNewPassword
        ) {
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
            return;
        }

        console.log("change-password", passwordForm);
        handleClosePasswordModal();
    };

    return (
        <>
            <Accordion
                expanded={expanded}
                onChange={onChange}
                elevation={0}
                disableGutters
                sx={{
                    mb: 1.5,
                    border: "1px solid #ebecef",
                    borderRadius: "12px !important",
                    overflow: "hidden",
                    bgcolor: "#ffffff",
                    "&:before": {
                        display: "none",
                    },
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreRoundedIcon sx={{ color: "#1f2430" }} />}
                    sx={{
                        minHeight: 56,
                        px: 2,
                        bgcolor: "#ffffff",
                        "& .MuiAccordionSummary-content": {
                            my: 0,
                        },
                    }}
                >
                    <Stack direction="row" alignItems="center" sx={{ margin: "auto" }} spacing={1.25}>
                        <PersonOutlineRoundedIcon sx={{ fontSize: 20, color: "#1f2430" }} />
                        <Typography
                            sx={{
                                fontSize: 16,
                                fontWeight: 700,
                                color: "#1f2430",
                            }}
                        >
                            About
                        </Typography>
                    </Stack>
                </AccordionSummary>

                <AccordionDetails
                    sx={{
                        px: 2,
                        pb: 2,
                        pt: 0.5,
                        bgcolor: "#ffffff",
                    }}
                >
                    <InfoRow
                        label="Full name"
                        fieldKey="fullname"
                        value={profile.fullname}
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
                        value={profile.username}
                        editingField={editingField}
                        editValue={editValue}
                        onStartEdit={handleStartEdit}
                        onChangeEdit={setEditValue}
                        onSaveEdit={handleSaveEdit}
                        onCancelEdit={handleCancelEdit}
                    />

                    <InfoRow
                        label="Email"
                        value={profile.email}
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
                                borderRadius: 2.5,
                                px: 2,
                                py: 1,
                                textTransform: "none",
                                fontWeight: 700,
                                borderColor: "rgba(111, 99, 246, 0.32)",
                                color: "#6f63f6",
                                "&:hover": {
                                    borderColor: "#6f63f6",
                                    bgcolor: "rgba(111, 99, 246, 0.06)",
                                },
                            }}
                        >
                            Đổi mật khẩu
                        </Button>
                    </Box>
                </AccordionDetails>
            </Accordion>

            <Dialog
                open={openPasswordModal}
                onClose={handleClosePasswordModal}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        p: 0.5,
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#1f2430",
                        pr: 6,
                    }}
                >
                    Đổi mật khẩu
                    <IconButton
                        onClick={handleClosePasswordModal}
                        sx={{
                            position: "absolute",
                            right: 12,
                            top: 12,
                            color: "#7d84a0",
                        }}
                    >
                        <CloseRoundedIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ pt: "8px !important" }}>
                    <Stack spacing={2}>
                        <TextField
                            label="Mật khẩu hiện tại"
                            type="password"
                            fullWidth
                            value={passwordForm.currentPassword}
                            onChange={(event) =>
                                setPasswordForm((prev) => ({
                                    ...prev,
                                    currentPassword: event.target.value,
                                }))
                            }
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2.5,
                                },
                            }}
                        />

                        <TextField
                            label="Mật khẩu mới"
                            type="password"
                            fullWidth
                            value={passwordForm.newPassword}
                            onChange={(event) =>
                                setPasswordForm((prev) => ({
                                    ...prev,
                                    newPassword: event.target.value,
                                }))
                            }
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2.5,
                                },
                            }}
                        />

                        <TextField
                            label="Xác nhận mật khẩu mới"
                            type="password"
                            fullWidth
                            value={passwordForm.confirmNewPassword}
                            onChange={(event) =>
                                setPasswordForm((prev) => ({
                                    ...prev,
                                    confirmNewPassword: event.target.value,
                                }))
                            }
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2.5,
                                },
                            }}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
                    <Button
                        onClick={handleClosePasswordModal}
                        sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            color: "#7b8190",
                        }}
                    >
                        Hủy
                    </Button>

                    <Button
                        onClick={handleSubmitPassword}
                        variant="contained"
                        sx={{
                            borderRadius: 2.5,
                            px: 2,
                            textTransform: "none",
                            fontWeight: 700,
                            boxShadow: "none",
                            bgcolor: "#6f63f6",
                            "&:hover": {
                                boxShadow: "none",
                                bgcolor: "#5f53eb",
                            },
                        }}
                    >
                        Cập nhật
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}