import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AdminIdCard from "../../components/admin/Profiles/AdminIdCard";
import AdminIdentityForm from "../../components/admin/Profiles/AdminIdentityForm";
import AdminPasswordForm from "../../components/admin/Profiles/AdminPasswordForm";
import { AdminProfileSkeleton } from "../../components/admin/Profiles/AdminProfileSkeleton";
import { useProfileAdmin } from "../../hooks/admin/profileAdmin.hook";

export const ProfileAdminPage = () => {

  const {ui, data, handler} = useProfileAdmin();

  if (ui.isLoading && !data.profileAdmin) {
    return <AdminProfileSkeleton />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3.5,
        pb: 4,
        maxWidth: 1100,
        mx: "auto",
        width: "100%",
        textAlign: "left",
      }}
    >
      {/* Page Title & Subtitle */}
      <Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.35rem", sm: "1.5rem" },
            color: "#0F172A",
            letterSpacing: "-0.02em",
          }}
        >
          Profile Management
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#64748B",
            fontSize: "0.875rem", 
            mt: 0.5,
          }}
        >
          Location for updating administrator information
        </Typography>
      </Box>

      {/* Top Banner: Digital Admin ID Card */}
      <AdminIdCard
        data={data.profileAdmin}
        isUploading={ui.isUploadingAvatar}
        avatarPreview={ui.avatarPreview}
        onUploadAvatar={handler.onUpdateAvatar}
      />

      {/* Two Edit Columns: Left = Identity, Right = Password */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
          maxWidth: 960,
          width: "100%",
          mx: "auto",
        }}
      >
        {/* Left Card: Edit Identity Information */}
        <AdminIdentityForm data = { data.profileAdmin } onSave={handler.onUpdateProfile}/>

        {/* Right Card: Security & Change Password */}
        <AdminPasswordForm onSave = {handler.onUpdateProfile}/>
      </Box>
    </Box>
  );
};

export default ProfileAdminPage;
