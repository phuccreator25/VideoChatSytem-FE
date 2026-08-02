import { getSocket } from "./socket";

export type BlockSocketPayload = {
    userId: string;
    isBlockedMe?: boolean;
    isBlockedByMe?: boolean;
};

export const bindBlockUser = (callback: (payload: BlockSocketPayload) => void) => {
    const socket = getSocket();
    socket.off("block:user", callback);
    socket.on("block:user", callback);
}

export const unbindBlockUser = (callback: (payload: BlockSocketPayload) => void) => {
    const socket = getSocket();
    socket.off("block:user", callback);
}

export const bindUnblockUser = (callback: (payload: BlockSocketPayload) => void) => {
    const socket = getSocket();
    socket.off("unblock:user", callback);
    socket.on("unblock:user", callback);
}

export const unbindUnblockUser = (callback: (payload: BlockSocketPayload) => void) => {
    const socket = getSocket();
    socket.off("unblock:user", callback);
}