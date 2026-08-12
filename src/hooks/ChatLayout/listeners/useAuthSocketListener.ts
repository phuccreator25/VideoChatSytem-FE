import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { bindBanSession, unbindBanSession } from "../../../socket/authSocket.socket";
import { disconnectSocket } from "../../../socket/socket";
import useAuth from "../../Auth/auth.hook";

export default function useAuthSocketListener() {
    const navigate = useNavigate();
    const { handleLogOut } = useAuth();

    useEffect(() => {
        const handleBanSessionEvent = async (payload: { message?: string }) => {
            enqueueSnackbar(payload?.message || "Phiên đăng nhập của bạn đã bị thu hồi", {
                variant: "warning",
                autoHideDuration: 4000,
            });

            try {
                await handleLogOut()
            } catch (error) {
                console.error(error)
            } finally {
                disconnectSocket();
                navigate("/login", { replace: true });
            }
        };

        bindBanSession(handleBanSessionEvent);

        return () => {
            unbindBanSession(handleBanSessionEvent);
        };
    }, [navigate]);
}
