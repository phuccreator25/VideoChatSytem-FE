import { Box, InputBase, Popover } from "@mui/material";
import type { IGif } from "@giphy/js-types";
import type { GifsResult } from "@giphy/js-fetch-api";
import type { Dispatch, SetStateAction } from "react";
import { Grid } from "@giphy/react-components";

type typeGifPopoverProps = {
  isGifOpen: boolean;
  gifAnchorEl: HTMLElement | null;

  setGifAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>;

  gifSearch: string;

  setGifSearch: Dispatch<SetStateAction<string>>;

  fetchGifs: (offset: number) => Promise<GifsResult>;

  onSelectGif: (gif: IGif) => void;
};

export function GifPopover({
  isGifOpen,
  gifAnchorEl,
  setGifAnchorEl,
  setGifSearch,
  gifSearch,
  fetchGifs,
  onSelectGif,
}: typeGifPopoverProps) {
  const handleClose = () => {
    setGifAnchorEl(null);
    setGifSearch("");
  };

  return (
    <Popover
      open={isGifOpen}
      anchorEl={gifAnchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      marginThreshold={12}
      keepMounted
      transitionDuration={{
        enter: 170,
        exit: 115,
      }}
      PaperProps={{
        sx: {
          mt: -1.4,
          cursor: "pointer",
          width: {
            xs: "calc(100vw - 28px)",
            sm: 390,
          },
          maxWidth: 390,
          height: {
            xs: "min(70vh, 520px)",
            sm: 480,
          },
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid rgba(148, 163, 184, 0.22)",
          bgcolor: "rgba(255, 255, 255, 0.96)",
          backdropFilter: "blur(18px)",
          boxShadow:
            "0 18px 48px rgba(15, 23, 42, 0.18), 0 6px 18px rgba(67, 56, 202, 0.1)",
          position: "relative",

          "&::after": {
            content: '""',
            position: "absolute",
            left: "50%",
            bottom: -7,
            width: 14,
            height: 14,
            bgcolor: "rgba(255, 255, 255, 0.96)",
            borderRight: "1px solid rgba(148, 163, 184, 0.22)",
            borderBottom: "1px solid rgba(148, 163, 184, 0.22)",
            transform: "translateX(-50%) rotate(45deg)",
          },
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          p: 1.2,
        }}
      >
        <InputBase
          autoFocus
          placeholder="Tìm kiếm GIF..."
          value={gifSearch}
          onChange={(event) => setGifSearch(event.target.value)}
          sx={{
            flexShrink: 0,
            mb: 1.2,
            px: 1.5,
            height: 42,
            borderRadius: 2.5,
            bgcolor: "rgba(241, 245, 249, 0.9)",
            border: "1px solid rgba(148, 163, 184, 0.22)",
            fontSize: 14,
            color: "#0f172a",

            "& input::placeholder": {
              color: "#64748b",
              opacity: 1,
            },

            "&.Mui-focused": {
              borderColor: "rgba(67, 56, 202, 0.5)",
              boxShadow: "0 0 0 3px rgba(67, 56, 202, 0.08)",
            },
          }}
        />

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            borderRadius: 2,
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(100, 116, 139, 0.45) transparent",

            "&::-webkit-scrollbar": {
              width: 8,
            },

            "&::-webkit-scrollbar-thumb": {
              borderRadius: 999,
              background: "rgba(100, 116, 139, 0.45)",
              border: "2px solid transparent",
              backgroundClip: "padding-box",
            },
          }}
        >
          {isGifOpen && (
            <Grid
            key={gifSearch}
            width={350}
            columns={2}
            gutter={6}
            fetchGifs={fetchGifs}
            noLink
            hideAttribution={false}
            onGifClick={(gif: any, event: any) => {
              event.preventDefault();
              onSelectGif(gif);
              setGifAnchorEl(null);
              setGifSearch("");
            }}
          />
          )}
        </Box>
      </Box>
    </Popover>
  );
}
