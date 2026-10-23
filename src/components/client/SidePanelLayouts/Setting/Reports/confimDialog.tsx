import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CircularProgress from "@mui/material/CircularProgress";
import Zoom from "@mui/material/Zoom";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import type { IReportTicket } from "../../../../../types/Report.type";

export default function DialogConfirmCancel({
    openRevokeDialog,
    handleCloseRevokeDialog,
    handleConfirmRevoke,
    isRevoking,
    report,
}: {
    openRevokeDialog: boolean;
    handleCloseRevokeDialog: () => void;
    handleConfirmRevoke: () => void;
    isRevoking: boolean;
    report: IReportTicket;
}) {
    return (
        <Dialog
            open={openRevokeDialog}
            onClose={!isRevoking ? handleCloseRevokeDialog : undefined}
            maxWidth="xs"
            fullWidth
            TransitionComponent={Zoom}
            transitionDuration={200}
            PaperProps={{
                sx: {
                    borderRadius: '20px',
                    bgcolor: '#FFFFFF',
                    border: '1px solid rgba(239, 68, 68, 0.15)',
                    boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.15)',
                    overflow: 'hidden',
                    p: 1,
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pb: 1,
                    pt: 2,
                    px: 2.5,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '12px',
                            display: 'grid',
                            placeItems: 'center',
                            bgcolor: 'rgba(239, 68, 68, 0.1)',
                            color: '#DC2626',
                        }}
                    >
                        <WarningAmberRoundedIcon sx={{ fontSize: 24 }} />
                    </Box>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>
                        Revoke Report
                    </Typography>
                </Box>
                <IconButton
                    size="small"
                    onClick={handleCloseRevokeDialog}
                    disabled={isRevoking}
                    sx={{
                        color: '#94A3B8',
                        '&:hover': { bgcolor: '#F1F5F9', color: '#475569' },
                    }}
                >
                    <CloseRoundedIcon sx={{ fontSize: 18 }} />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ px: 2.5, py: 1.5 }}>
                <Typography sx={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.6 }}>
                    Are you sure you want to revoke this report
                    {report.targetUser?.fullname ? (
                        <>
                            {' '}against{' '}
                            <Box component="span" sx={{ fontWeight: 700, color: '#0F172A' }}>
                                {report.targetUser.fullname}
                            </Box>
                        </>
                    ) : null}
                    ?
                </Typography>
                <Typography sx={{ fontSize: '12.5px', color: '#64748B', mt: 1, lineHeight: 1.5 }}>
                    Once revoked, this report will be cancelled and removed from the moderator review queue. This action cannot be undone.
                </Typography>
            </DialogContent>

            <DialogActions
                sx={{
                    px: 2.5,
                    pt: 2,
                    pb: 2,
                    gap: 1.5,
                    borderTop: '1px solid #F1F5F9',
                }}
            >
                <Button
                    onClick={handleCloseRevokeDialog}
                    disabled={isRevoking}
                    variant="outlined"
                    size="small"
                    sx={{
                        textTransform: 'none',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#475569',
                        borderColor: '#CBD5E1',
                        borderRadius: '10px',
                        px: 2,
                        py: 0.8,
                        '&:hover': {
                            bgcolor: '#F8FAFC',
                            borderColor: '#94A3B8',
                        },
                    }}
                >
                    Cancel
                </Button>

                <Button
                    onClick={handleConfirmRevoke}
                    disabled={isRevoking}
                    variant="contained"
                    size="small"
                    startIcon={
                        isRevoking ? (
                            <CircularProgress size={15} color="inherit" />
                        ) : (
                            <DeleteOutlineRoundedIcon sx={{ fontSize: 17 }} />
                        )
                    }
                    sx={{
                        textTransform: 'none',
                        fontSize: '13px',
                        fontWeight: 600,
                        bgcolor: '#DC2626',
                        boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
                        borderRadius: '10px',
                        px: 2.5,
                        py: 0.8,
                        '&:hover': {
                            bgcolor: '#B91C1C',
                            boxShadow: '0 6px 16px rgba(220, 38, 38, 0.35)',
                        },
                    }}
                >
                    {isRevoking ? 'Revoking...' : 'Confirm Revoke'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}