import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

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
    <Typography
      sx={{
        fontSize: 20,
        fontWeight: 700,
        color: "#1f2937",
      }}
    >
      {title} ({count})
    </Typography>
  );
}

export default function InvitationsFrame() {
  const {
    handleAcceptInvitation,
    handleCancelSentInvitation,
    handleDeclineInvitation,
    getTimeAgo,
    handleRemoveReceivedInvitation,
    handleRemoveSentInvitation
  } = useInvitation();

  const {
    receivedAllInvitations,
    sentInvitations,
    loadingReceived,
    loadingSent,
    hasMoreReceived,
    hasMoreSent,
    handleLoadMoreReceived,
    handleLoadMoreSent,
    countReceived
  } = useInvitationAll({ pageSize: 3 });

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: 4,
        overflow: "hidden",
        bgcolor: "#ffffff",
        border: "1px solid #e7e7ee",
        boxShadow: "0 10px 30px rgba(20, 20, 43, 0.08)",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <Box
        sx={{
          px: 4,
          py: 2.5,
          bgcolor: "#fff",
        }}
      >
        <Typography
          sx={{
            fontSize: 24,
            fontWeight: 750,
            color: "#111827",
          }}
        >
          Danh sách lời mời
        </Typography>
      </Box>

      <Divider sx={{ borderColor: COLORS.border }} />

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          px: 4,
          py: 4,
          bgcolor: "#f9fafb",
          ...customScrollbarSx,
        }}
      >
        <Stack spacing={4}>
          <Box>
            <InvitationSectionTitle
              title="Lời mời đã nhận"
              count={countReceived}
            />

            <Box
              sx={{
                mt: 2,
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(3, minmax(0, 1fr))",
                },
                gap: 2,
                alignItems: "stretch",
              }}
            >
              {receivedAllInvitations.map((item) => (
                <ReceivedInvitationCard
                  key={item.id}
                  item={item}
                  onAccept={handleAcceptInvitation}
                  onDecline={handleDeclineInvitation}
                  getTimeAgo={getTimeAgo}
                  handleRemoveReceivedInvitation={handleRemoveReceivedInvitation}
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
                    minWidth: 180,
                    height: 42,
                    borderRadius: 999,
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: 15,
                    borderColor: "#cbd5e1",
                    color: "#334155",
                    bgcolor: "#fff",
                    "&:hover": {
                      borderColor: "#94a3b8",
                      bgcolor: "#f8fafc",
                    },
                    "&.Mui-disabled": {
                      bgcolor: "#f8fafc",
                      color: "#94a3b8",
                      borderColor: "#e2e8f0",
                    },
                  }}
                >
                  {loadingReceived ? "Đang tải..." : "Xem thêm lời mời nhận"}
                </Button>
              </Box>
            )}
          </Box>

          <Box>
            <InvitationSectionTitle
              title="Lời mời đã gửi"
              count={sentInvitations.length}
            />

            <Box
              sx={{
                mt: 2,
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(3, minmax(0, 1fr))",
                },
                gap: 2,
                alignItems: "stretch",
              }}
            >
              {sentInvitations.map((item) => (
                <SentInvitationCard
                  key={item.id}
                  item={item}
                  onRecall={handleCancelSentInvitation}
                  getTimeAgo={getTimeAgo}
                  handleRemoveSentInvitation={handleRemoveSentInvitation}
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
                    minWidth: 180,
                    height: 42,
                    borderRadius: 999,
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: 15,
                    borderColor: "#cbd5e1",
                    color: "#334155",
                    bgcolor: "#fff",
                    "&:hover": {
                      borderColor: "#94a3b8",
                      bgcolor: "#f8fafc",
                    },
                    "&.Mui-disabled": {
                      bgcolor: "#f8fafc",
                      color: "#94a3b8",
                      borderColor: "#e2e8f0",
                    },
                  }}
                >
                  {loadingSent ? "Đang tải..." : "Xem thêm lời mời gửi"}
                </Button>
              </Box>
            )}
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}