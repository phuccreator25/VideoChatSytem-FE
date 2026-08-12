import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import AuthLayout from "../../layouts/Auth.layout";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

// Lazy loading pages to optimize initial bundle size & load speed
const LoginPage = lazy(() => import("../../pages/Auth/Login.page"));
const RegisterPage = lazy(() => import("../../pages/Auth/Register.page"));
const ForgotPasswordPage = lazy(() => import("../../pages/Auth/ForgotPassword.page"));
const CheckEmailPage = lazy(() => import("../../pages/Auth/CheckEmail.page"));
const ResetPasswordPage = lazy(() => import("../../pages/Auth/ResetPassword.page"));
const ActiveSuccess = lazy(() => import("../../pages/Auth/ActiveSuccess.page"));
const ChatPage = lazy(() => import("../../pages/Chat/Chat.page"));
const InvitationPages = lazy(() => import("../../pages/Invitation/Invitaiton.page"));

const PageLoadingFallback = () => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      width: "100%",
      bgcolor: "background.default",
    }}
  >
    <CircularProgress size={40} />
  </Box>
);

const CheckAuth = () => {
  const user = useSelector((state: RootState) => state.user.currentUser)
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};

const HomeRedirect = () => {
  const user = useSelector((state: RootState) => state.user.currentUser)

  return <Navigate to={user ? "/chat" : "/login"} replace />;
};

export default function ClientRoute() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoadingFallback />}>
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
      </Suspense>
    </BrowserRouter>
  );
}
