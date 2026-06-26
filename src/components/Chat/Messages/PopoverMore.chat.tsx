import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import type { MessageType } from "../../../types/chat.type";
import useDownloadFile from "../../../helpers/downloadFile.helper";
import { enqueueSnackbar } from "notistack";
import { onPinMessageConversation } from "../../../redux/conversation.redux";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import ChatAPI from "../../../api/Chat.api";

export type MessageMorePopoverVariant = "text" | "file" | "image";

type Props = {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    variant?: MessageMorePopoverVariant;
    message: MessageType
};

type MenuItem = {
    key: string;
    label: string;
    icon: React.ReactNode;
    color?: string;
    onClick: () => void;
};

export function MessageMorePopover({
    anchorEl,
    open,
    onClose,
    variant = "text",
    message
}: Props) {

    const { onHandleDownloadFile } = useDownloadFile()
    const { conversationId } = useParams()
    const dispatch = useDispatch<AppDispatch>();

    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const currentUserId = currentUser?._id || "";


    const onCopy = async () => {
        if (!message.content) return

        await navigator.clipboard.writeText(message.content);
        onClose()
    }

    const onSave = async () => {
        if (!message.attachments?.length) return;

        for (const attachment of message.attachments) {
            if (!attachment.fileUrl) continue;

            await onHandleDownloadFile(attachment.fileUrl, attachment.fileName ?? 'Download');
        }
    };

    const onPin = async () => {
        if (!message || !conversationId) return

        try {
            await dispatch(onPinMessageConversation({ conversationId, messageId: message.id }))
            onClose()
        } catch (error: any) {
            console.log('PIN MESSAGES ERROR: ', error);
            enqueueSnackbar('Message pinning error', {
                variant: 'error'
            })
        }
    }

    const onDeleteMessage = async () => {
        if (!message || !conversationId) return

        try {
            await ChatAPI.onDeleteMessage(conversationId, message.id)
            onClose()
        } catch (error: any) {
            console.log('DELETE MESSAGES ERROR: ', error);
            enqueueSnackbar('Message delete error', {
                variant: 'error'
            })
        }
    }

    const onRevokeMessage = async () => {
        if (!message || !conversationId) return

        if (message.senderId !== currentUserId) {
            enqueueSnackbar('You can only delete your own messages', {
                variant: 'warning'
            })
            return
        }

        try {
            await ChatAPI.onRevokeMessage(conversationId, message.id)
            onClose()
        } catch (error: any) {
            console.log('REVOKE MESSAGES ERROR: ', error);
            enqueueSnackbar('Message revoke error', {
                variant: 'error'
            })
        }
    }

    const iconSx = { fontSize: 18 };

    const textItems: MenuItem[] = [
        {
            key: "copy",
            label: "Copy message",
            icon: <ContentCopyIcon sx={iconSx} />,
            onClick: onCopy,
        },
        {
            key: "pin",
            label: "Pin message",
            icon: <PushPinOutlinedIcon sx={iconSx} />,
            onClick: onPin,
        },
    ];

    const fileItems: MenuItem[] = [
        {
            key: "save",
            label: "Save " + message.attachments?.length + " files",
            icon: <SaveAltIcon sx={iconSx} />,
            onClick: onSave,
        },
        {
            key: "pin",
            label: "Pin message",
            icon: <PushPinOutlinedIcon sx={iconSx} />,
            onClick: onPin,
        },
    ];

    const mainItems = variant === "text" ? textItems : fileItems;

    const isSender = message.senderId === currentUserId;

    const dangerItems: MenuItem[] = [
        ...(isSender ? [
            {
                key: "revoke",
                label: "Delete For Everyone",
                icon: <RemoveCircleOutlineIcon sx={iconSx} />,
                color: "error.main",
                onClick: () => onRevokeMessage()
            }
        ] : []),
        {
            key: "deleteForMe",
            label: "Delete For Me",
            icon: <DeleteOutlineIcon sx={iconSx} />,
            color: "error.main",
            onClick: () => onDeleteMessage()
        },
    ];

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
            slotProps={{
                paper: {
                    elevation: 12,
                    sx: {
                        mt: 0.75,
                        minWidth: 220,
                        borderRadius: "16px",
                        bgcolor: "background.paper",
                        border: "1px solid rgba(148, 163, 184, 0.15)",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.15)",
                        overflow: "hidden",
                    },
                },
            }}
        >
            {/* Top Gradient Highlight Bar */}

            <List disablePadding dense sx={{ py: 0.5 }}>
                {mainItems.map((item) => (
                    <ListItemButton
                        key={item.key}
                        onClick={item.onClick}
                        sx={{
                            px: 2,
                            py: 1,
                            gap: 1.5,
                            borderLeft: "3px solid transparent",
                            transition: "all 0.15s ease",
                            "&:hover": {
                                bgcolor: "action.hover",
                                borderLeftColor: "primary.main",
                                pl: 2.25,
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{ minWidth: "unset", color: item.color ?? "text.secondary" }}
                        >
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.label}
                            slotProps={{
                                primary: {
                                    sx: {
                                        fontSize: "0.875rem",
                                        fontWeight: 500,
                                        color: item.color ?? "text.primary",
                                    },
                                },
                            }}
                        />
                    </ListItemButton>
                ))}

                <Divider sx={{ my: 0.5, borderColor: "rgba(148, 163, 184, 0.12)" }} />

                {dangerItems.map((item) => (
                    <ListItemButton
                        key={item.key}
                        onClick={item.onClick}
                        sx={{
                            px: 2,
                            py: 1,
                            gap: 1.5,
                            borderLeft: "3px solid transparent",
                            transition: "all 0.15s ease",
                            "&:hover": {
                                bgcolor: "rgba(239, 68, 68, 0.04)",
                                borderLeftColor: "error.main",
                                pl: 2.25,
                            },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: "unset", color: item.color }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.label}
                            slotProps={{
                                primary: {
                                    sx: {
                                        fontSize: "0.875rem",
                                        fontWeight: 500,
                                        color: item.color,
                                    },
                                },
                            }}
                        />
                    </ListItemButton>
                ))}
            </List>
        </Popover>
    );
}