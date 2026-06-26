import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { keyframes } from "@mui/system";

import { COLORS } from "../../../utils/Colors";

const rowAppear = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const bubbleAppear = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.88);
  }

  70% {
    transform: scale(1.04);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const dotBounce = keyframes`
  0%, 60%, 100% {
    transform: translateY(0) scale(0.8);
    opacity: 0.35;
  }

  30% {
    transform: translateY(-6px) scale(1);
    opacity: 1;
  }
`;

const typingPulse = keyframes`
  0%, 100% {
    opacity: 0.55;
  }

  50% {
    opacity: 1;
  }
`;

type TypingIndicatorProps = {
  isLeft?: boolean;
  avatar?: string;
  displayName?: string;
};

export function TypingIndicator({
  isLeft = true,
  avatar = "",
  displayName = "User",
}: TypingIndicatorProps) {
  return (
    <Stack
      direction={isLeft ? "row" : "row-reverse"}
      spacing={1.5}
      alignItems="flex-end"
      sx={{
        width: "100%",
        animation: `${rowAppear} 260ms ease-out`,
      }}
    >
      <Avatar
        src={avatar}
        alt={displayName}
        sx={{
          width: 42,
          height: 42,
          flexShrink: 0,
          border: "2px solid rgba(255,255,255,0.9)",
          boxShadow: "0 8px 18px rgba(15, 23, 42, 0.16)",
        }}
      >
        {displayName.charAt(0).toUpperCase()}
      </Avatar>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: isLeft ? "flex-start" : "flex-end",
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            minWidth: 112,
            minHeight: 44,
            px: 1.8,
            py: 1.1,
            bgcolor: isLeft
              ? "rgba(255,255,255,0.96)"
              : "rgba(238,242,255,0.96)",
            border: "1px solid rgba(148, 163, 184, 0.22)",
            borderRadius: isLeft
              ? "18px 18px 18px 6px"
              : "18px 18px 6px 18px",
            boxShadow: isLeft
              ? "0 8px 22px rgba(15, 23, 42, 0.07)"
              : "0 8px 22px rgba(79, 70, 229, 0.12)",
            animation: `${bubbleAppear} 320ms cubic-bezier(0.22, 1, 0.36, 1)`,
            transformOrigin: isLeft ? "bottom left" : "bottom right",
          }}
        >
          <Typography
            sx={{
              fontSize: 13.5,
              fontWeight: 650,
              lineHeight: 1,
              whiteSpace: "nowrap",
              color: isLeft ? COLORS.textSoft : "#4f46e5",
              animation: `${typingPulse} 1.3s ease-in-out infinite`,
            }}
          >
            Typing
          </Typography>

          <Stack
            direction="row"
            spacing={0.45}
            alignItems="center"
            sx={{
              height: 16,
              flexShrink: 0,
            }}
          >
            {[0, 1, 2].map((dot) => (
              <Box
                key={dot}
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: isLeft
                    ? "rgba(79, 70, 229, 0.82)"
                    : "#4f46e5",
                  animation: `${dotBounce} 1.15s ease-in-out infinite`,
                  animationDelay: `${dot * 150}ms`,
                  willChange: "transform, opacity",
                }}
              />
            ))}
          </Stack>
        </Box>

        <Typography
          sx={{
            mt: 0.65,
            px: 0.35,
            maxWidth: 180,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: 12.5,
            color: COLORS.textMuted,
            fontWeight: 600,
            textAlign: isLeft ? "left" : "right",
          }}
        >
          {displayName}
        </Typography>
      </Box>
    </Stack>
  );
}