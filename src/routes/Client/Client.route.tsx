import { lazy } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import AuthLayout from "../../layouts/client/Auth.layout";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

const LoginPage = lazy(() => import("../../pages/client/Auth/Login.page"));
const RegisterPage = lazy(() => import("../../pages/client/Auth/Register.page"));
const ForgotPasswordPage = lazy(() => import("../../pages/client/Auth/ForgotPassword.page"));
const CheckEmailPage = lazy(() => import("../../pages/client/Auth/CheckEmail.page"));
const ResetPasswordPage = lazy(() => import("../../pages/client/Auth/ResetPassword.page"));
const ActiveSuccess = lazy(() => import("../../pages/client/Auth/ActiveSuccess.page"));
const ChatPage = lazy(() => import("../../pages/client/Chat/Chat.page"));
const InvitationPages = lazy(() => import("../../pages/client/Invitation/Invitaiton.page"));

const CheckAuth = () => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};

const HomeRedirect = () => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  return <Navigate to={user ? "/chat" : "/login"} replace />;
};

export default function ClientRoute() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/check-email/:email" element={<CheckEmailPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/active-account" element={<ActiveSuccess />} />
      </Route>

      <Route element={<CheckAuth />}>
        <Route path="/chat/:conversationId?" element={<ChatPage />} />
        <Route path="/invitation" element={<InvitationPages />} />
      </Route>

      <Route path="/" element={<HomeRedirect />} />
    </Routes>
  );
}
