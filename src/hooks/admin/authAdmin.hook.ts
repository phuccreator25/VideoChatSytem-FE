import { useNavigate } from "react-router-dom";
import type { typeLogin } from "../../types/auth.type";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { clearCurrentAdmin, onLogin } from "../../redux/admin/authAdmin.redux";
import { enqueueSnackbar } from "notistack";
import authAdminAPI from "../../api/admin/authAdmin.api";

export function useAuthAdmin() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const handleLogin = async (data: typeLogin) => {
        try {
            const res = await dispatch(onLogin(data)).unwrap();

            if (res) {
                enqueueSnackbar("Signed in successfully", {
                    variant: "success",
                });
                navigate("/admin");
            }

        } catch (error: any) {
            console.error('Login error:', error);
            enqueueSnackbar(error?.response?.data?.message || "Login failed", {
                variant: "error",
            });
            throw error
        }
    }

    const handleLogOut = async () => {
        try {
            await authAdminAPI.onLogOut();
            enqueueSnackbar("Signed out successfully", {
                variant: "success",
            });
        } catch (error: any) {
            console.error('Logout error:', error);
            enqueueSnackbar(error?.response?.data?.message || "Logout failed", {
                variant: "error",
            });
            throw error
        } finally {
            dispatch(clearCurrentAdmin());
            navigate("/admin/login", { replace: true });
        }
    }

    return {
        handler: {
            handleLogin,
            handleLogOut
        }
    }
}