import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import AdminLayout from "../../layouts/admin/Admin.layout";
import { UserAdminPage } from "../../pages/admin/userAdmin.page";
import AdminLoginPage from "../../pages/admin/adminLogin.pages";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

const CheckAuth = () => {
  const admin = useSelector((state: RootState) => state.admin.currentAdmin);
  if (!admin) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
};

const LoginRedirect = () => {
  const admin = useSelector((state: RootState) => state.admin.currentAdmin);
  if (admin) return <Navigate to="/admin/users" replace />;
  return <Outlet />;
};

export default function AdminRoute() {
  return (
    <Routes>
      <Route element={<CheckAuth />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="users" replace />} />
          <Route path="users" element={<UserAdminPage />} />
        </Route>
      </Route>

      <Route element={<LoginRedirect />}>
        <Route path="login" element={<AdminLoginPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}