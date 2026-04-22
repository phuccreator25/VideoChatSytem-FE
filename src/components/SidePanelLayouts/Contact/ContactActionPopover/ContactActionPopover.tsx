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
import { ViewUserInfoModal } from "./ModalViewInfo";
import { ConfirmRemoveFriendModal } from "./ModalConfirmRemove";
import { ConfirmBlockModal } from "./ModalConfirmBlock";
import type { RowActionProps } from "../../../../types/contact.type";

type ContactActionPopoverProps = {
    rowAction: RowActionProps;
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

export function ContactActionPopover({ rowAction }: ContactActionPopoverProps) {
    const { data, ui, handlers } = rowAction;

    return (
        <>
            <Popover
                open={Boolean(ui.anchorEl)}
                anchorEl={ui.anchorEl}
                onClose={handlers.handleClosePopover}
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
                    <MenuItem
                        sx={itemSx}
                        onClick={() => {
                            handlers.setOpenModalViewInfo(true);
                            handlers.handleClosePopover();
                        }}
                    >
                        <InfoOutlinedIcon sx={{ fontSize: 18, color: "#6f63f6" }} />
                        <Typography sx={{ fontSize: 15, fontWeight: 550, color: "#6f63f6" }}>
                            View info
                        </Typography>
                    </MenuItem>

                    <Divider sx={{ borderColor: "#f3e8ff" }} />

                    <MenuItem
                        sx={itemSx}
                        onClick={() => {
                            handlers.setOpenSetNicknameModal(true);
                            handlers.handleClosePopover();
                        }}
                    >
                        <DriveFileRenameOutlineRoundedIcon sx={{ fontSize: 18, color: "#6f63f6" }} />
                        <Typography sx={{ fontSize: 15, fontWeight: 550, color: "#6f63f6" }}>
                            Set nickname
                        </Typography>
                    </MenuItem>

                    <Divider sx={{ borderColor: "#f3e8ff" }} />

                    <MenuItem
                        sx={itemSx}
                        onClick={() => {
                            handlers.setOpenModalBlock(true);
                            handlers.handleClosePopover();
                        }}
                    >
                        <BlockRoundedIcon sx={{ fontSize: 18, color: "#6f63f6" }} />
                        <Typography sx={{ fontSize: 15, fontWeight: 550, color: "#6f63f6" }}>
                            {data.selectedContact?.isBlocked ? "Unblock this user" : "Block this user"}
                        </Typography>
                    </MenuItem>

                    <Divider sx={{ borderColor: "#f3e8ff" }} />

                    <MenuItem
                        onClick={() => {
                            handlers.setOpenModalRemove(true);
                            handlers.handleClosePopover();
                        }}
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
                open={ui.openSetNicknameModal}
                onClose={() => handlers.setOpenSetNicknameModal(false)}
                onConfirm={handlers.onUpdateNickName}
                selectedContact={data.selectedContact}
            />

            <ViewUserInfoModal
                open={ui.openModalViewInfo}
                onClose={() => handlers.setOpenModalViewInfo(false)}
                user={data.selectedContact}
                setOpenSetNicknameModal={handlers.setOpenSetNicknameModal}
                setOpenModalRemove={handlers.setOpenModalRemove}
                setOpenModalBlock={handlers.setOpenModalBlock}
            />

            <ConfirmRemoveFriendModal
                open={ui.openModalRemove}
                onClose={() => handlers.setOpenModalRemove(false)}
                onConfirm={handlers.onRemoveFriend}
                selectedContact={data.selectedContact}
            />

            <ConfirmBlockModal
                open={ui.openModalBlock}
                onClose={() => handlers.setOpenModalBlock(false)}
                onConfirm={handlers.handleBlock}
                selectedContact={data.selectedContact}
                handleUnblock={handlers.handleUnblock}
            />
        </>
    );
}