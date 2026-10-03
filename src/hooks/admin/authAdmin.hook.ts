import { useNavigate } from "react-router-dom";
import type { typeLogin } from "../../types/auth.type";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { onLogin } from "../../redux/admin/authAdmin.redux";
import { enqueueSnackbar } from "notistack";

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
    return {
        ui: {
        },
        data: {

        },
        handler: {
            handleLogin
        }
    }
}