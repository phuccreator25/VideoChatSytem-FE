import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DriveFileRenameOutlineRoundedIcon from "@mui/icons-material/DriveFileRenameOutlineRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { SetNicknameModal } from "./ModalSetNickName";
import type { contacts } from "../../../../types/contact.type";

type ContactActionPopoverProps = {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    onViewInfo?: (userId: string) => void;
    onBlockUser?: (userId: string) => void;
    onRemoveFriend?: (userId: string) => void;
    setOpenSetNicknameModal: React.Dispatch<React.SetStateAction<boolean>>
    openSetNicknameModal: boolean,
    onUpdateNickName: (data: contacts) => void
    selectedContact: contacts | null
};

const itemSx = {
    minHeight: 44,
    px: 2,
    py: 1.25,
    fontSize: 15,
    fontWeight: 500,
    color: "#6f63f6",
    display: "flex",
    alignItems: "center",
    gap: 1.25,
    "&:hover": {
        backgroundColor: "rgba(111, 99, 246, 0.08)",
    },
};

export function ContactActionPopover({
    anchorEl,
    open,
    onClose,
    onViewInfo,
    onBlockUser,
    onRemoveFriend,
    setOpenSetNicknameModal, openSetNicknameModal, onUpdateNickName, selectedContact
}: ContactActionPopoverProps) {

    return (
        <>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={onClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                PaperProps={{
                    sx: {
                        mt: 1,
                        minWidth: 220,
                        borderRadius: 3,
                        backgroundColor: "#ffffff",
                        border: "1px solid #ede9fe",
                        boxShadow: "0 10px 10px rgba(110, 79, 160, 0.12)",
                        overflow: "hidden",
                    },
                }}
            >
                <Box sx={{ py: 1 }}>
                    <MenuItem sx={itemSx} onClick={() => onViewInfo}>
                        <InfoOutlinedIcon sx={{ fontSize: 18, color: "#6f63f6" }} />
                        <Typography sx={{ fontSize: 15, fontWeight: 550, color: "#6f63f6" }}>
                            View info
                        </Typography>
                    </MenuItem>

                    <Divider sx={{ borderColor: "#f3e8ff" }} />

                    <MenuItem sx={itemSx} 
                        onClick={() => {
                        setOpenSetNicknameModal(true); 
                        onClose()
                    }}>
                        <DriveFileRenameOutlineRoundedIcon sx={{ fontSize: 18, color: "#6f63f6" }} />
                        <Typography sx={{ fontSize: 15, fontWeight: 550, color: "#6f63f6" }}>
                            Set nickname
                        </Typography>
                    </MenuItem>

                    <Divider sx={{ borderColor: "#f3e8ff" }} />

                    <MenuItem sx={itemSx} onClick={() => onBlockUser}>
                        <BlockRoundedIcon sx={{ fontSize: 18, color: "#6f63f6" }} />
                        <Typography sx={{ fontSize: 15, fontWeight: 550, color: "#6f63f6" }}>
                            Block this user
                        </Typography>
                    </MenuItem>

                    <Divider sx={{ borderColor: "#f3e8ff" }} />

                    <MenuItem
                        onClick={() => onRemoveFriend}
                        sx={{
                            ...itemSx,
                            color: "#dc2626",
                            "&:hover": {
                                backgroundColor: "#fef2f2",
                            },
                        }}
                    >
                        <DeleteOutlineRoundedIcon sx={{ fontSize: 18, color: "#dc2626" }} />
                        <Typography sx={{ fontSize: 15, fontWeight: 550, color: "#dc2626" }}>
                            Remove friend
                        </Typography>
                    </MenuItem>
                </Box>
            </Popover>
            <SetNicknameModal
                open={openSetNicknameModal}
                onClose={() => setOpenSetNicknameModal(false)}
                onConfirm={onUpdateNickName}
                selectedContact={selectedContact}
            />
        </>
    );
}