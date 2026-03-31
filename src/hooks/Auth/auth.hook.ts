import { useState } from "react";
import authApi from "../../api/Auth.api";
import { CONFIG } from "../../config/appConfig";
import type { typeLogin, typeRegister } from "../../types/auth.type";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { clearCurrentUser, onLogin } from "../../redux/auth.redux";
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../redux/store'

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

  const { email } = useParams<{ email: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch<AppDispatch>()

  const handleRegister = async (payload: typeRegister) => {
    try {
      setLoading(true);

      const dataRegister = {
        ...payload,
        link: `${CONFIG.APP_HOST}/active-account?${new URLSearchParams({
          email: payload.email,
        }).toString()}`,
      };

      const res = await authApi.onRegister(dataRegister);

      if (res.status === 201) {
        setisShowAlert(true);
        settypeAlert("success");
        enqueueSnackbar("Đăng ký thành công, vui lòng kiểm tra email để kích hoạt tài khoản", {
          variant: "success",
        });
      }
    } catch (error: any) {
      console.error("Register failed:", error.response?.data?.message);
      setisShowAlert(false);
      enqueueSnackbar(error?.response?.data?.message || "Đăng ký thất bại", {
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

      const res =  await dispatch(onLogin({ email, password, deviceId })).unwrap();
      console.log(res);
      
      if (res) {
        enqueueSnackbar("Đăng nhập thành công", {
          variant: "success",
        });
        navigate("/chat");
      }
    } catch (error: any) {
      console.error("Login failed:", error.response?.data?.message);
      enqueueSnackbar(error?.response?.data?.message || "Đăng nhập thất bại", {
        variant: "error",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogOut = async () => {
    try {
      const res = await authApi.onLogOut();

      if (res.status === 200) {
        enqueueSnackbar("Đăng xuất thành công", {
          variant: "success",
        });
        dispatch(clearCurrentUser());
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Logout failed:", error.response?.data?.message);
      enqueueSnackbar(error?.response?.data?.message || "Đăng xuất thất bại", {
        variant: "error",
      });
    }
  };

  const handleForgotPass = async (data: ForgotPasswordPayload) => {
    try {
      setLoading(true);
      const res = await authApi.onForgotPassword(data);

      if (res.status === 200) {
        enqueueSnackbar("Đã gửi email đặt lại mật khẩu", {
          variant: "success",
        });
        navigate(`/check-email/${encodeURIComponent(data.email)}`);
      }
    } catch (error: any) {
      console.error("Forgot failed:", error.response?.data?.message);
      enqueueSnackbar(
        error?.response?.data?.message || "Gửi yêu cầu quên mật khẩu thất bại",
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
      if (!email) {
        throw new Error("Yêu cầu không hợp lệ. Vui lòng thử lại");
      }

      setLoading(true);

      const res = await authApi.onResetPassword(email, payload);

      if (res.status === 200) {
        enqueueSnackbar("Đặt lại mật khẩu thành công", {
          variant: "success",
        });
        navigate(`/login?email=${encodeURIComponent(email)}`);
      }
    } catch (error: any) {
      console.error("Reset failed:", error.response?.data?.message || error.message);
      enqueueSnackbar(
        error?.response?.data?.message || error.message || "Đặt lại mật khẩu thất bại",
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