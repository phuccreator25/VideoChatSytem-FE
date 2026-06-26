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
                py: 1.75,
                borderBottom: '1px solid #f1f2f6',
                '&:last-of-type': {
                    borderBottom: 'none',
                },
            }}
        >
            <Stack spacing={1}>
                <Typography
                    sx={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: '#7a8195',
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
                                fontSize: 16,
                                fontWeight: 600,
                                color: '#1f2430',
                                wordBreak: 'break-word',
                                textAlign: 'left',
                            }}
                        >
                            {value}
                        </Typography>

                        {!readOnly && fieldKey && onStartEdit && (
                            <Button
                                onClick={() => onStartEdit(fieldKey, value)}
                                startIcon={<EditRoundedIcon />}
                                size="small"
                                sx={{
                                    minWidth: 0,
                                    px: 1.25,
                                    color: '#6f63f6',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    borderRadius: 2,
                                    '&:hover': {
                                        bgcolor: 'rgba(111, 99, 246, 0.08)',
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
                        spacing={1.25}
                        alignItems={{ xs: 'stretch', sm: 'center' }}
                    >
                        <TextField
                            fullWidth
                            size="small"
                            value={editValue}
                            onChange={(event) => onChangeEdit?.(event.target.value)}
                            placeholder={label}
                            variant='standard'
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2.5,
                                    bgcolor: '#ffffff',
                                },
                            }}
                        />

                        <Stack direction="row" spacing={0.75} sx={{ flexShrink: 0 }}>
                            <Button
                                onClick={onSaveEdit}
                                startIcon={<SaveRoundedIcon sx={{ fontSize: 18 }} />}
                                variant="contained"
                                size="small"
                                sx={{
                                    minWidth: 0,
                                    px: 1.25,
                                    height: 36,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    boxShadow: 'none',
                                    bgcolor: '#6f63f6',
                                    '& .MuiButton-startIcon': {
                                        mr: 0.5,
                                    },
                                    '&:hover': {
                                        boxShadow: 'none',
                                        bgcolor: '#5f53eb',
                                    },
                                }}
                            >
                                Lưu
                            </Button>

                            <Button
                                onClick={onCancelEdit}
                                variant="text"
                                size="small"
                                sx={{
                                    minWidth: 0,
                                    px: 1,
                                    height: 36,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    color: '#7b8190',
                                }}
                            >
                                Hủy
                            </Button>
                        </Stack>
                    </Stack>
                )}
            </Stack>
        </Box>
    );
}
