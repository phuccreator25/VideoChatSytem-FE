import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

type ContactRelation = "add" | "received" | "sent" | "none";
type ContactAction = "add" | "accept" | "decline" | "cancel";

type ContactRelationBarProps = {
  status: ContactRelation;
  displayName?: string;
  invitationId?: string | null;
  loadingAction?: ContactAction | null;
  addContactModalOpen?: boolean;
  addContactMessage?: string;
  addContactSubmitting?: boolean;
  onAddContact?: () => void;
  onCloseAddContactModal?: () => void;
  onChangeAddContactMessage?: (value: string) => void;
  onSubmitAddContact?: () => void | Promise<void>;
  onAccept?: () => void | Promise<void>;
  onDecline?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
};

export function ContactRelationBar({
  status,
  displayName,
  loadingAction = null,
  addContactModalOpen = false,
  addContactMessage = "",
  addContactSubmitting = false,
  onAddContact,
  onCloseAddContactModal,
  onChangeAddContactMessage,
  onSubmitAddContact,
  onAccept,
  onDecline,
  onCancel,
}: ContactRelationBarProps) {
  if (status === "none") return null;
  const canSubmitInvitation = addContactMessage.trim().length > 0;

  const name = displayName?.trim() || "this user";

  const titleByStatus: Record<Exclude<ContactRelation, "none">, string> = {
    add: `You and ${name} are not contacts yet`,
    received: `${name} sent you a contact request`,
    sent: `Contact request sent to ${name}`,
  };

  const subtitleByStatus: Record<Exclude<ContactRelation, "none">, string> = {
    add: "Add contact to start syncing relationship and actions across sessions.",
    received: "You can accept or decline this request.",
    sent: "You can cancel this request any time.",
  };

  return (
    <Box
      sx={{
        mx: { xs: 2, sm: 3, md: 3.5 },
        mt: 2,
        p: { xs: 1.5, sm: 2 },
        borderRadius: 3,
        background:
          "linear-gradient(130deg, rgba(255,255,255,0.98) 0%, rgba(244,247,255,0.95) 100%)",
        border: "1px solid rgba(148, 163, 184, 0.24)",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
      }}
    >
      <Stack
        spacing={1.25}
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "flex-start", md: "flex-start" }}
        justifyContent="space-between"
      >
        <Box sx={{ minWidth: 0, textAlign: "left" }}>
          <Typography
            sx={{
              fontSize: { xs: 14, sm: 15 },
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.3,
            }}
          >
            {titleByStatus[status]}
          </Typography>

          <Typography
            sx={{
              mt: 0.4,
              fontSize: { xs: 12.5, sm: 13 },
              color: "#64748b",
              lineHeight: 1.45,
            }}
          >
            {subtitleByStatus[status]}
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ width: { xs: "100%", md: "auto" } }}
        >
          {status === "add" && (
            <Button
              variant="contained"
              onClick={onAddContact}
              disabled={loadingAction !== null}
              sx={{
                minWidth: 132,
                width: { xs: "100%", sm: "auto" },
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 2,
                background: "linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)",
                boxShadow: "0 10px 24px rgba(37, 99, 235, 0.28)",
                "&:hover": {
                  background: "linear-gradient(135deg, #4338ca 0%, #1d4ed8 100%)",
                },
              }}
            >
              {loadingAction === "add" ? "Adding..." : "Add Contact"}
            </Button>
          )}

          {status === "received" && (
            <>
              <Button
                variant="contained"
                onClick={() => onAccept?.()}
                disabled={loadingAction !== null}
                sx={{
                  minWidth: 110,
                  width: { xs: "100%", sm: "auto" },
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #059669 0%, #16a34a 100%)",
                  boxShadow: "0 10px 24px rgba(22, 163, 74, 0.24)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #047857 0%, #15803d 100%)",
                  },
                }}
              >
                {loadingAction === "accept" ? "Accepting..." : "Accept"}
              </Button>

              <Button
                variant="outlined"
                onClick={() => onDecline?.()}
                disabled={loadingAction !== null}
                sx={{
                  minWidth: 110,
                  width: { xs: "100%", sm: "auto" },
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: 2,
                  color: "#475569",
                  borderColor: "rgba(148, 163, 184, 0.5)",
                  "&:hover": {
                    borderColor: "rgba(100, 116, 139, 0.75)",
                    bgcolor: "rgba(241, 245, 249, 0.7)",
                  },
                }}
              >
                {loadingAction === "decline" ? "Declining..." : "Decline"}
              </Button>
            </>
          )}

          {status === "sent" && (
            <Button
              variant="outlined"
              onClick={() => onCancel?.()}
              disabled={loadingAction !== null}
              sx={{
                minWidth: 110,
                width: { xs: "100%", sm: "auto" },
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 2,
                color: "#6b21a8",
                borderColor: "rgba(168, 85, 247, 0.38)",
                "&:hover": {
                  borderColor: "rgba(147, 51, 234, 0.62)",
                  bgcolor: "rgba(243, 232, 255, 0.62)",
                },
              }}
            >
              {loadingAction === "cancel" ? "Cancelling..." : "Cancel"}
            </Button>
          )}
        </Stack>
      </Stack>

      <Dialog
        open={addContactModalOpen}
        onClose={onCloseAddContactModal}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid rgba(148, 163, 184, 0.22)",
            boxShadow: "0 18px 45px rgba(15, 23, 42, 0.16)",
            background:
              "linear-gradient(165deg, rgba(255,255,255,0.98) 0%, rgba(244,247,255,0.97) 100%)",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>
            Send contact invitation
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: 13, color: "#64748b" }}>
            Personalize a short message before sending.
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            multiline
            minRows={4}
            value={addContactMessage}
            onChange={(e) => onChangeAddContactMessage?.(e.target.value)}
            placeholder="Write a short invitation message"
            InputProps={{
              sx: {
                borderRadius: 2,
                bgcolor: "#ffffff",
              },
            }}
            helperText={`${addContactMessage.trim().length} characters`}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.25, pt: 0.5, gap: 1 }}>
          <Button
            onClick={onCloseAddContactModal}
            disabled={addContactSubmitting}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "#475569",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmitAddContact}
            variant="contained"
            disabled={addContactSubmitting || !canSubmitInvitation}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2,
              px: 2,
              background: "linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)",
              boxShadow: "0 10px 24px rgba(37, 99, 235, 0.28)",
              "&:hover": {
                background: "linear-gradient(135deg, #4338ca 0%, #1d4ed8 100%)",
              },
            }}
          >
            {addContactSubmitting ? "Sending..." : "Send invitation"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
