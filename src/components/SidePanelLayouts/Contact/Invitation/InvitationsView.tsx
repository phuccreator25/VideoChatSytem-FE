import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { useNavigate } from "react-router-dom";

import { customScrollbarSx } from "../../../../utils/CustomScroll";
import { COLORS } from "../../../../utils/Colors";
import { ReceivedInvitationCard } from "./ReceivedInvitationCard";
import { SentInvitationCard } from "./SentInvitationCard";
import useInvitation from "../../../../hooks/Invitation/Invitation.hook";
import useInvitationAll from "../../../../hooks/Invitation/InvitationAll.hook";

function InvitationSectionTitle({
  title,
  count,
}: {
  title: string;
  count: number;
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        p: { xs: 1.5, sm: 2 },
        borderRadius: 3,
        bgcolor: "#ffffff",
        border: "1px solid #e7ebf3",
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: 17, sm: 20 },
          fontWeight: 750,
          color: "#172033",
          lineHeight: 1.2,
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          minWidth: 34,
          height: 30,
          px: 1.25,
          borderRadius: 999,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(47, 108, 255, 0.1)",
          color: "#204ecf",
          fontSize: 14,
          fontWeight: 800,
        }}
      >
        {count}
      </Box>
    </Stack>
  );
}

export default function InvitationsFrame() {
  const { helpers } = useInvitation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

  const {
    receivedAllInvitations,
    sentInvitations,
    loadingReceived,
    loadingSent,
    hasMoreReceived,
    hasMoreSent,
    handleLoadMoreReceived,
    handleLoadMoreSent,
    countReceived,
    countSent,
  } = useInvitationAll({ pageSize: 3 });

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: { xs: 0, sm: 4 },
        overflow: "hidden",
        bgcolor: "#f6f8fd",
        border: { xs: "none", sm: "1px solid #dfe5f1" },
        boxShadow: { xs: "none", sm: "0 12px 36px rgba(26, 40, 74, 0.08)" },
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <Box
        sx={{
          px: { xs: 2, sm: 4 },
          py: { xs: 2.25, sm: 3 },
          bgcolor: "#ffffff",
          backgroundImage:
            "linear-gradient(130deg, rgba(43,108,255,0.14), rgba(54,179,126,0.08) 68%, rgba(255,255,255,0.92))",
        }}
      >
        <Stack spacing={0.75}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ ml: isMobile ? -0.5 : 0 }}>
            {isMobile && (
              <IconButton onClick={() => navigate("/chat")} sx={{ color: "#13213f", p: 0.5 }}>
                <ArrowBackIosNewRoundedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            )}
            <Typography
              sx={{
                fontSize: { xs: 22, sm: 26 },
                fontWeight: 800,
                color: "#13213f",
                letterSpacing: "-0.01em",
                lineHeight: 1.15,
              }}
            >
              Connection Invitations
            </Typography>
          </Stack>
          <Typography
            sx={{
              fontSize: { xs: 13, sm: 14 },
              color: "#4c5d84",
              fontWeight: 500,
            }}
          >
            Review and manage incoming and outgoing invitations in real time.
          </Typography>
        </Stack>
      </Box>

      <Divider sx={{ borderColor: COLORS.border }} />

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          px: { xs: 2, sm: 4 },
          py: { xs: 2.5, sm: 4 },
          bgcolor: "#f6f8fd",
          ...customScrollbarSx,
        }}
      >
        <Stack spacing={{ xs: 3, sm: 4 }}>
          <Box>
            <InvitationSectionTitle title="Received Invitations" count={countReceived} />

            <Box
              sx={{
                mt: 2.25,
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(3, minmax(0, 1fr))",
                },
                gap: { xs: 1.5, sm: 2 },
                alignItems: "stretch",
              }}
            >
              {receivedAllInvitations.map((item) => (
                <ReceivedInvitationCard
                  key={item.id}
                  item={item}
                  getTimeAgo={helpers.getTimeAgo}
                />
              ))}
            </Box>

            {hasMoreReceived && (
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleLoadMoreReceived}
                  disabled={loadingReceived}
                  sx={{
                    minWidth: 200,
                    height: 44,
                    borderRadius: 999,
                    textTransform: "none",
                    fontWeight: 750,
                    fontSize: 15,
                    borderColor: "#aac0ef",
                    color: "#2f5dcc",
                    bgcolor: "#ffffff",
                    px: 2.5,
                    "&:hover": {
                      borderColor: "#6f93e6",
                      bgcolor: "#f2f6ff",
                    },
                    "&.Mui-disabled": {
                      bgcolor: "#f7f9fe",
                      color: "#8da4d5",
                      borderColor: "#e2e8f0",
                    },
                  }}
                >
                  {loadingReceived ? "Loading..." : "Load More Received"}
                </Button>
              </Box>
            )}
          </Box>

          <Box>
            <InvitationSectionTitle title="Sent Invitations" count={countSent} />

            <Box
              sx={{
                mt: 2.25,
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(3, minmax(0, 1fr))",
                },
                gap: { xs: 1.5, sm: 2 },
                alignItems: "stretch",
              }}
            >
              {sentInvitations.map((item) => (
                <SentInvitationCard
                  key={item.id}
                  item={item}
                  getTimeAgo={helpers.getTimeAgo}
                />
              ))}
            </Box>

            {hasMoreSent && (
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleLoadMoreSent}
                  disabled={loadingSent}
                  sx={{
                    minWidth: 200,
                    height: 44,
                    borderRadius: 999,
                    textTransform: "none",
                    fontWeight: 750,
                    fontSize: 15,
                    borderColor: "#aac0ef",
                    color: "#2f5dcc",
                    bgcolor: "#ffffff",
                    px: 2.5,
                    "&:hover": {
                      borderColor: "#6f93e6",
                      bgcolor: "#f2f6ff",
                    },
                    "&.Mui-disabled": {
                      bgcolor: "#f7f9fe",
                      color: "#8da4d5",
                      borderColor: "#e2e8f0",
                    },
                  }}
                >
                  {loadingSent ? "Loading..." : "Load More Sent"}
                </Button>
              </Box>
            )}
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}
