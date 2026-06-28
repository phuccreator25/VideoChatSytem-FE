import type { ContactRemoveSocket, ContactUpdateNickNameSocket } from "../types/contact/contact.socket.type";
import { getSocket } from "./socket";

export const bindContactRemove = (callback: (payload: ContactRemoveSocket) => void) => {
    const socket = getSocket();
    socket.off("contact:removed", callback);
    socket.on("contact:removed", callback)
}

export const unbindContactRemove = (callback: (payload: ContactRemoveSocket) => void) => {
    const socket = getSocket();
    socket.off("contact:removed", callback);
}

export const bindContactUpdateNickName = (callback: (payload: ContactUpdateNickNameSocket) => void) => {
    const socket = getSocket();
    socket.off("contact:updateNickName", callback);
    socket.on("contact:updateNickName", callback)
}

export const unbindContactUpdateNickName = (callback: (payload: ContactUpdateNickNameSocket) => void) => {
    const socket = getSocket();
    socket.off("contact:updateNickName", callback);
}
