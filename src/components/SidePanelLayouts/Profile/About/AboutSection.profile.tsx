import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";

import type {
  EditableFieldKey,
  ProfileData,
} from "../../../../types/profile/profile.model.type";
import { InfoRow } from "./InfoRow.profile";
import { ChangePasswordModal } from "../../Setting/ChangePasswordModal";

type AboutSectionProps = {
    profile: ProfileData | null;
    expanded: boolean;
    onChange: (_event: any, isExpanded: boolean) => void;
    onUpdate: (payload: object) => void;
};


export function AboutSection({
    profile,
    onUpdate
}: AboutSectionProps) {
    const [editingField, setEditingField] = useState<EditableFieldKey | null>(null);
    const [editValue, setEditValue] = useState("");
    const [openPasswordModal, setOpenPasswordModal] = useState(false);

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
                        value={profile?.fullname || ""}
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
                        value={profile?.username || ""}
                        editingField={editingField}
                        editValue={editValue}
                        onStartEdit={handleStartEdit}
                        onChangeEdit={setEditValue}
                        onSaveEdit={handleSaveEdit}
                        onCancelEdit={handleCancelEdit}
                    />

                    <InfoRow
                        label="Email"
                        value={profile?.email || ""}
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

            <ChangePasswordModal
                open={openPasswordModal}
                onClose={() => setOpenPasswordModal(false)}
            />
        </>
    );
}
