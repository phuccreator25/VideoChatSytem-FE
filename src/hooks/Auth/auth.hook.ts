import { useState } from "react";
import authApi from "../../api/Auth.api";
import type { typeLogin, typeRegister } from "../../types/auth.type";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { clearCurrentUser, onLogin } from "../../redux/auth.redux";
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../redux/store'
import { disconnectSocket } from "../../socket/socket";

type ForgotPasswordPayload = {
  email: string;
};

type ResetPasswordPayload = {
  password: string;
};

function useAuth() {
  const [isShowAlert, setisShowAlert] = useState<boolean>(false);
  const [typeAlert, settypeAlert] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  // const { email } = useParams<{ email: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch<AppDispatch>()

  const handleRegister = async (payload: typeRegister) => {
    try {
      setLoading(true);

      const res = await authApi.onRegister(payload);

      if (res.status === 201) {
        setisShowAlert(true);
        settypeAlert("success");
        enqueueSnackbar(
          "Registration successful. Please check your email to activate your account",
          {
            variant: "success",
          }
        );
      }
    } catch (error: any) {
      console.error("Register failed:", error.response?.data?.message);
      setisShowAlert(false);
      enqueueSnackbar(error?.response?.data?.message || "Registration failed", {
        variant: "error",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async ({ email, password, deviceId }: typeLogin) => {
    try {
      setLoading(true);

      const res = await dispatch(onLogin({ email, password, deviceId })).unwrap();

      if (res) {
        enqueueSnackbar("Signed in successfully", {
          variant: "success",
        });
        navigate("/chat");
      }
    } catch (error: any) {
      console.error("Login failed:", error.response?.data?.message);
      enqueueSnackbar(error?.response?.data?.message, {
        variant: "error",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogOut = async () => {
    try {
      await authApi.onLogOut();

      enqueueSnackbar("Signed out successfully", {
        variant: "success",
      });
    } catch (error: any) {
      console.error("Logout API failed:", error?.response?.data?.message);

      enqueueSnackbar("Logged out from this device", {
        variant: "success",
      });
    } finally {
      disconnectSocket();
      dispatch(clearCurrentUser());
      navigate("/login", { replace: true });
    }
  };

  const handleForgotPass = async (data: ForgotPasswordPayload) => {
    try {
      setLoading(true);
      const res = await authApi.onForgotPassword(data);

      if (res.status === 200) {
        enqueueSnackbar("Password reset email sent", {
          variant: "success",
        });
        navigate(`/check-email/${encodeURIComponent(data.email)}`);
      }
    } catch (error: any) {
      console.error("Forgot failed:", error.response?.data?.message);
      enqueueSnackbar(
        error?.response?.data?.message || "Failed to send password reset request",
        {
          variant: "error",
        }
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleResetPass = async (payload: ResetPasswordPayload) => {
    try {
      if (!token) {
        throw new Error("Invalid request. Please try again");
      }

      setLoading(true);
      console.log(token, payload);

      const res = await authApi.onResetPassword(token, payload);

      if (res.status === 200) {
        enqueueSnackbar("Password reset successfully", {
          variant: "success",
        });
        navigate(`/login?email=${encodeURIComponent(res.data.data.email)}`);
      }
    } catch (error: any) {
      console.error("Reset failed:", error.response?.data?.message || error.message);
      enqueueSnackbar(
        error?.response?.data?.message || error.message || "Failed to reset password",
        {
          variant: "error",
        }
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleRegister,
    handleLogin,
    typeAlert,
    loading,
    isShowAlert,
    handleLogOut,
    handleForgotPass,
    handleResetPass,
  };
}

export default useAuth;