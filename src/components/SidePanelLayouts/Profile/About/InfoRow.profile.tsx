import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import type { InfoRowProps } from "../../../../types/profile/profile.ui.type";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

export function InfoRow({
    label,
    fieldKey,
    value,
    editingField,
    editValue,
    onStartEdit,
    onChangeEdit,
    onSaveEdit,
    onCancelEdit,
    readOnly,
}: InfoRowProps) {
    const isEditing = !!fieldKey && editingField === fieldKey;

    return (
        <Box
            sx={{
                p: 2,
                border: '1px solid rgba(148, 163, 184, 0.1)',
                borderRadius: '12px',
                bgcolor: 'rgba(248, 250, 252, 0.5)',
                mb: 1.5,
                transition: 'all 0.22s ease',
                '&:hover': {
                    borderColor: 'rgba(79, 70, 229, 0.15)',
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.02)',
                },
                '&:last-of-type': {
                    mb: 0,
                },
            }}
        >
            <Stack spacing={1}>
                <Typography
                    sx={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        textAlign: 'start'
                    }}
                >
                    {label}
                </Typography>

                {!isEditing ? (
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={2}
                    >
                        <Typography
                            sx={{
                                flex: 1,
                                minWidth: 0,
                                fontSize: 15,
                                fontWeight: 600,
                                color: '#0f172a',
                                wordBreak: 'break-word',
                                textAlign: 'left',
                            }}
                        >
                            {value}
                        </Typography>

                        {!readOnly && fieldKey && onStartEdit && (
                            <Button
                                onClick={() => onStartEdit(fieldKey, value)}
                                startIcon={<EditRoundedIcon sx={{ fontSize: 16 }} />}
                                size="small"
                                sx={{
                                    minWidth: 0,
                                    px: 1.5,
                                    py: 0.5,
                                    color: '#4f46e5',
                                    fontWeight: 700,
                                    fontSize: '12px',
                                    textTransform: 'none',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(79, 70, 229, 0.15)',
                                    transition: 'all 0.18s ease',
                                    '&:hover': {
                                        borderColor: '#4f46e5',
                                        bgcolor: 'rgba(79, 70, 229, 0.05)',
                                    },
                                }}
                            >
                                Edit
                            </Button>
                        )}
                    </Stack>
                ) : (
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1.5}
                        alignItems={{ xs: 'stretch', sm: 'center' }}
                    >
                        <TextField
                            fullWidth
                            size="small"
                            value={editValue}
                            onChange={(event) => onChangeEdit?.(event.target.value)}
                            placeholder={label}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    bgcolor: '#ffffff',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                },
                            }}
                        />

                        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
                            <Button
                                onClick={onSaveEdit}
                                startIcon={<SaveRoundedIcon sx={{ fontSize: 16 }} />}
                                variant="contained"
                                size="small"
                                sx={{
                                    minWidth: 0,
                                    px: 1.5,
                                    height: 36,
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    boxShadow: 'none',
                                    bgcolor: '#4f46e5',
                                    '& .MuiButton-startIcon': {
                                        mr: 0.5,
                                    },
                                    '&:hover': {
                                        boxShadow: 'none',
                                        bgcolor: '#4338ca',
                                    },
                                }}
                            >
                                Save
                            </Button>

                            <Button
                                onClick={onCancelEdit}
                                variant="text"
                                size="small"
                                sx={{
                                    minWidth: 0,
                                    px: 1.5,
                                    height: 36,
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    color: '#64748b',
                                    '&:hover': {
                                        bgcolor: 'rgba(100, 116, 139, 0.08)',
                                    }
                                }}
                            >
                                Cancel
                            </Button>
                        </Stack>
                    </Stack>
                )}
            </Stack>
        </Box>
    );
}
