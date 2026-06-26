import type { ContactRemoveSocket } from "../types/contact/contact.socket.type";
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
