import { Box, Popover } from "@mui/material";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";

type typeEmojiPopover = {
    isEmojiOpen: boolean;
    emojiAnchorEl: HTMLElement | null;
    setEmojiAnchorEl: React.Dispatch<
        React.SetStateAction<HTMLElement | null>
    >;
    onApplyEmoji: (emoji: string) => void;
}

export function EmoijPopover({
    isEmojiOpen,
    emojiAnchorEl,
    setEmojiAnchorEl,
    onApplyEmoji
}: typeEmojiPopover) {
    return (
        <Popover
            open={isEmojiOpen}
            anchorEl={emojiAnchorEl}
            onClose={() => setEmojiAnchorEl?.(null)}
            anchorOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
            transformOrigin={{
                vertical: "bottom",
                horizontal: "center",
            }}
            marginThreshold={12}
            transitionDuration={{
                enter: 170,
                exit: 115,
            }}
            PaperProps={{
                sx: {
                    mt: -1.4,
                    width: { xs: "calc(100vw - 28px)", sm: 360 },
                    maxWidth: 360,
                    borderRadius: 3,
                    overflow: "visible",
                    border: "1px solid rgba(148, 163, 184, 0.22)",
                    bgcolor: "rgba(255, 255, 255, 0.92)",
                    backdropFilter: "blur(18px)",
                    transformOrigin: "50% 100%",
                    willChange: "transform, opacity",
                    transition:
                        "box-shadow 180ms ease, border-color 180ms ease, background-color 180ms ease",
                    boxShadow:
                        "0 18px 48px rgba(15, 23, 42, 0.18), 0 6px 18px rgba(67, 56, 202, 0.1)",
                    "@media (prefers-reduced-motion: reduce)": {
                        transition: "none",
                    },
                    "&::after": {
                        content: '""',
                        position: "absolute",
                        left: "50%",
                        bottom: -7,
                        width: 14,
                        height: 14,
                        bgcolor: "rgba(255, 255, 255, 0.92)",
                        borderRight: "1px solid rgba(148, 163, 184, 0.22)",
                        borderBottom: "1px solid rgba(148, 163, 184, 0.22)",
                        transform: "translateX(-50%) rotate(45deg)",
                        backdropFilter: "blur(18px)",
                    },
                },
            }}
        >
            {isEmojiOpen && (
                <Box
                    sx={{
                        position: "relative",
                        zIndex: 1,
                        p: 1,
                        borderRadius: 3,
                        overflow: "hidden",
                        "& .EmojiPickerReact": {
                            width: "100% !important",
                            border: "0 !important",
                            borderRadius: "18px !important",
                            bgcolor: "transparent !important",
                            boxShadow: "none !important",
                            fontFamily: "inherit",
                            "--epr-bg-color": "transparent",
                            "--epr-category-label-bg-color": "rgba(255, 255, 255, 0.86)",
                            "--epr-hover-bg-color": "rgba(99, 102, 241, 0.1)",
                            "--epr-focus-bg-color": "rgba(99, 102, 241, 0.14)",
                            "--epr-highlight-color": "#4338ca",
                            "--epr-search-border-color": "rgba(99, 102, 241, 0.32)",
                        },
                        "& .epr-search-container": {
                            px: 0.5,
                            pt: 0.5,
                        },
                        "& .epr-search-container input": {
                            height: 42,
                            borderRadius: "12px !important",
                            bgcolor: "rgba(248, 250, 252, 0.92)",
                            color: "#0f172a",
                            fontSize: 14,
                            boxShadow: "inset 0 1px 2px rgba(15, 23, 42, 0.04)",
                        },
                        "& .epr-category-nav": {
                            px: 0.5,
                            py: 0.7,
                            borderBottom: "1px solid rgba(148, 163, 184, 0.14)",
                        },
                        "& .epr-body": {
                            pr: 0.4,
                            scrollbarWidth: "thin",
                            scrollbarColor: "rgba(100, 116, 139, 0.45) transparent",
                        },
                        "& .epr-body::-webkit-scrollbar": {
                            width: 8,
                        },
                        "& .epr-body::-webkit-scrollbar-thumb": {
                            borderRadius: 999,
                            background: "rgba(100, 116, 139, 0.45)",
                            border: "2px solid transparent",
                            backgroundClip: "padding-box",
                        },
                        "& .epr-emoji-category-label": {
                            color: "#475569",
                            fontSize: "13px !important",
                            fontWeight: "700 !important",
                            letterSpacing: "0 !important",
                        },
                        "& .epr-emoji": {
                            borderRadius: "10px !important",
                        },
                    }}
                >
                    <EmojiPicker
                        width="100%"
                        height="min(58vh, 380px)"
                        emojiStyle={EmojiStyle.NATIVE}
                        lazyLoadEmojis
                        searchPlaceholder="Search emoji"
                        previewConfig={{
                            showPreview: false,
                        }}
                        onEmojiClick={(emojiData) => {
                            onApplyEmoji(emojiData.emoji);
                        }}
                    />
                </Box>
            )}
        </Popover>
    );
}