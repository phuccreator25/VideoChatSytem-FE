import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { bindBanSession, unbindBanSession } from "../../../../socket/client/authSocket.socket";
import { disconnectSocket } from "../../../../socket/socket";
import { useDispatch } from "react-redux";
import { clearCurrentUser } from "../../../../redux/client/auth.redux";
import { persistor, type AppDispatch } from "../../../../redux/store";

export default function useAuthSocketListener() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const handleBanSessionEvent = async (payload: { message?: string }) => {
            enqueueSnackbar(payload?.message || "Your session has been revoked", {
                variant: "warning",
                autoHideDuration: 4000,
            });

            try {
                disconnectSocket();
                dispatch(clearCurrentUser());
                await persistor.purge();
            } catch (error) {
                console.error(error);
            } finally {
                disconnectSocket();
                navigate("/login", { replace: true });
            }
        };

        bindBanSession(handleBanSessionEvent);

        return () => {
            unbindBanSession(handleBanSessionEvent);
        };
    }, [navigate, dispatch]);
}
