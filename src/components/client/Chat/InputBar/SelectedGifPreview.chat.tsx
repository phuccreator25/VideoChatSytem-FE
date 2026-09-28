import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

type SelectedGif = {
    provider: "giphy";
    providerId: string;
    title: string;
    url: string;
    previewUrl: string;
    width: number;
    height: number;
};

type SelectedGifPreviewProps = {
    gif: SelectedGif | null;
    onRemove?: () => void;
};

export function SelectedGifPreview({
    gif,
    onRemove,
}: SelectedGifPreviewProps) {
    if (!gif) return null;

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-start",
                mb: 1.5,
            }}
        >
            <Box
                sx={{
                    display: "inline-flex",
                    flexDirection: "column",
                    position: "relative",
                    width: 220,
                    overflow: "hidden",
                    borderRadius: 3,
                    border: "1px solid rgba(148, 163, 184, 0.25)",
                    bgcolor: "rgba(248, 250, 252, 0.94)",
                    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
                }}
            >
                <Box
                    component="img"
                    src={gif.previewUrl}
                    alt={gif.title || "Selected GIF"}
                    sx={{
                        display: "block",
                        width: 220,
                        height: 150,
                        objectFit: "cover",
                    }}
                />

                <IconButton
                    size="small"
                    onClick={onRemove}
                    sx={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        width: 28,
                        height: 28,
                        color: "#ffffff",
                        bgcolor: "rgba(15, 23, 42, 0.68)",
                        backdropFilter: "blur(6px)",
                        "&:hover": {
                            bgcolor: "rgba(15, 23, 42, 0.88)",
                        },
                    }}
                >
                    <CloseRoundedIcon fontSize="small" />
                </IconButton>

                <Typography
                    sx={{
                        px: 1.2,
                        py: 0.8,
                        color: "#64748b",
                        fontSize: 11,
                        fontWeight: 700,
                    }}
                >
                    GIF
                </Typography>
            </Box>
        </Box>
    );
}