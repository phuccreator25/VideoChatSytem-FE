import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import AuthLayout from "../../layouts/Auth.layout";
import LoginPage from "../../pages/Auth/Login.page";
import RegisterPage from "../../pages/Auth/Register.page";
import ForgotPasswordPage from "../../pages/Auth/ForgotPassword.page";
import CheckEmailPage from "../../pages/Auth/CheckEmail.page";
import ResetPasswordPage from "../../pages/Auth/ResetPassword.page";
import ChatPage from "../../pages/Chat/Chat.page";
import ActiveSuccess from "../../pages/Auth/ActiveSuccess.page";
import { useSelector } from "react-redux";
import { SelectcurrentUser } from "../../redux/auth.redux";
import InvitationPages from "../../pages/Invitation/Invitaiton.page";

const CheckAuth = () => {
  const user = useSelector(SelectcurrentUser)
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};

const HomeRedirect = () => {
  const user = useSelector(SelectcurrentUser);

  return <Navigate to={user ? "/chat" : "/login"} replace />;
};

export default function ClientRoute() {
 
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/check-email/:email" element={<CheckEmailPage />} />
          <Route
            path="/reset-password/:email"
            element={<ResetPasswordPage />}
          />
          <Route path="/active-account" element={<ActiveSuccess />} />
        </Route>

        <Route element={<CheckAuth/>}>
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/invitation" element={<InvitationPages />} />
        </Route>

        <Route path="/" element={<HomeRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
