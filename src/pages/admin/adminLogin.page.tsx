import { useState } from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import { getVisitorId } from "../../config/FingerPrintJS";
import { useAuthAdmin } from "../../hooks/admin/authAdmin.hook";
import type { typeLogin } from "../../types/auth.type";


export const AdminLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { handler } = useAuthAdmin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<typeLogin>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onLogin = async (data: typeLogin) => {
    try {
      const deviceId = await getVisitorId();
      handler.handleLogin({ email: data.email, password: data.password, deviceId });
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",  
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",
        backgroundColor: "#0B0F19",
        // Dot Grid Matrix Pattern
        backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
        backgroundSize: { xs: "20px 20px", sm: "24px 24px" },
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* --- Background Glow Orbs Container (Clipped to prevent unwanted scrollbars) --- */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {/* --- Glow Orb 1: Purple (#7C3AED) at top-left --- */}
        <Box
          sx={{
            position: "absolute",
            top: "15%",
            left: { xs: "20%", md: "25%" },
            width: { xs: 220, sm: 300, md: 380 },
            height: { xs: 220, sm: 300, md: 380 },
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124, 58, 237, 0.45) 0%, rgba(124, 58, 237, 0) 70%)",
            filter: { xs: "blur(50px)", sm: "blur(70px)" },
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* --- Glow Orb 2: Indigo (#6366F1) at bottom-right --- */}
        <Box
          sx={{
            position: "absolute",
            bottom: "15%",
            right: { xs: "20%", md: "25%" },
            width: { xs: 240, sm: 320, md: 420 },
            height: { xs: 240, sm: 320, md: 420 },
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(99, 102, 241, 0) 70%)",
            filter: { xs: "blur(60px)", sm: "blur(80px)" },
            transform: "translate(50%, 50%)",
          }}
        />
      </Box>

      {/* --- Central Glowing Glassmorphic Pod (Card Outer with Gradient Border) --- */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: { xs: "100%", sm: 460, md: 520 },
          borderRadius: { xs: "20px", sm: "24px" },
          p: "1px", // 1px ultra-thin gradient border wrapper
          background: "linear-gradient(145deg, rgba(124, 58, 237, 0.9) 0%, rgba(99, 102, 241, 0.4) 50%, rgba(124, 58, 237, 0.15) 100%)",
          boxShadow: {
            xs: "0 15px 35px -10px rgba(0, 0, 0, 0.7), 0 0 30px rgba(124, 58, 237, 0.15)",
            sm: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 45px rgba(124, 58, 237, 0.2)",
          },
        }}
      >
        {/* Card Inner Frosted Glass */}
        <Box
          sx={{
            width: "100%",
            borderRadius: { xs: "19px", sm: "23px" },
            backgroundColor: "rgba(17, 24, 39, 0.78)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            px: { xs: 2.5, sm: 4, md: 5 },
            py: { xs: 3.5, sm: 4.5, md: 5 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxSizing: "border-box",
          }}
        >
          {/* Logo Squircle Badge */}
          <Box
            sx={{
              position: "relative",
              width: { xs: 50, sm: 58 },
              height: { xs: 50, sm: 58 },
              borderRadius: { xs: "15px", sm: "18px" },
              background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 20px rgba(124, 58, 237, 0.45)",
              mb: { xs: 2, sm: 2.5 },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "2px" }}>
              <ChatBubbleRoundedIcon sx={{ fontSize: { xs: 20, sm: 24 }, color: "#FFFFFF" }} />
              <BoltRoundedIcon sx={{ fontSize: { xs: 15, sm: 18 }, color: "#FDE047", ml: -0.5 }} />
            </Box>
          </Box>

          {/* Heading */}
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "1.2rem", sm: "1.35rem", md: "1.45rem" },
              fontWeight: 700,
              letterSpacing: "0.05em",
              color: "#FFFFFF",
              textAlign: "center",
              mb: 0.5,
              textTransform: "uppercase",
            }}
          >
            ADMIN CONSOLE
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              color: "#94A3B8",
              textAlign: "center",
              mb: { xs: 2.5, sm: 3.5 },
            }}
          >
            Chat App System Administration Portal
          </Typography>

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit(onLogin)}
            noValidate
            sx={{ width: "100%" }}
          >
            <Stack spacing={{ xs: 2.2, sm: 2.75 }} sx={{ width: "100%" }}>
              {/* Input 1: Email */}
              <TextField
                fullWidth
                label="Email"
                type="email"
                placeholder="admin@chatapp.io"
                autoComplete="email"
                {...register("email", {
                  required: "Please enter your email",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email",
                  },
                })}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#FFFFFF !important",
                    fontWeight: 500,
                    fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                    "&.Mui-focused": {
                      color: "#A5B4FC !important",
                    },
                    "&.Mui-error": {
                      color: "#F87171 !important",
                    },
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: { xs: "12px", sm: "14px" },
                    backgroundColor: "rgba(15, 23, 42, 0.7)",
                    color: "#FFFFFF",
                    fontSize: { xs: "0.875rem", sm: "0.95rem" },
                    transition: "all 0.25s ease",
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.14)",
                      borderWidth: "1px",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(129, 140, 248, 0.6)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.35), 0 0 16px rgba(124, 58, 237, 0.25)",
                      "& fieldset": {
                        borderColor: "#818CF8",
                        borderWidth: "1.5px",
                      },
                    },
                    "&.Mui-error": {
                      "& fieldset": {
                        borderColor: "#EF4444",
                      },
                    },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "#64748B",
                    opacity: 1,
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#F87171",
                    fontSize: "0.75rem",
                    mt: 0.5,
                    mx: 0.5,
                  },
                }}
              />

              {/* Input 2: Password */}
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••••••"
                autoComplete="current-password"
                {...register("password", {
                  required: "Please enter your password",
                })}
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((prev) => !prev)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                        size="small"
                        sx={{
                          color: "#94A3B8",
                          mr: 0.25,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            color: "#A5B4FC",
                            backgroundColor: "rgba(99, 102, 241, 0.1)",
                          },
                        }}
                      >
                        {showPassword ? (
                          <VisibilityOffRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                        ) : (
                          <VisibilityRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#FFFFFF !important",
                    fontWeight: 500,
                    fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                    "&.Mui-focused": {
                      color: "#A5B4FC !important",
                    },
                    "&.Mui-error": {
                      color: "#F87171 !important",
                    },
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: { xs: "12px", sm: "14px" },
                    backgroundColor: "rgba(15, 23, 42, 0.7)",
                    color: "#FFFFFF",
                    fontSize: { xs: "0.875rem", sm: "0.95rem" },
                    transition: "all 0.25s ease",
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.14)",
                      borderWidth: "1px",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(129, 140, 248, 0.6)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.35), 0 0 16px rgba(124, 58, 237, 0.25)",
                      "& fieldset": {
                        borderColor: "#818CF8",
                        borderWidth: "1.5px",
                      },
                    },
                    "&.Mui-error": {
                      "& fieldset": {
                        borderColor: "#EF4444",
                      },
                    },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "#64748B",
                    opacity: 1,
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#F87171",
                    fontSize: "0.75rem",
                    mt: 0.5,
                    mx: 0.5,
                  },
                }}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                disabled={isSubmitting}
                sx={{
                  py: { xs: 1.3, sm: 1.5 },
                  borderRadius: { xs: "12px", sm: "14px" },
                  background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)",
                  color: "#FFFFFF",
                  fontSize: { xs: "0.875rem", sm: "0.95rem" },
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  boxShadow: "0 8px 24px -4px rgba(124, 58, 237, 0.55), 0 4px 12px -2px rgba(99, 102, 241, 0.35)",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  mt: { xs: 0.5, sm: 1 },
                  "&:hover": {
                    background: "linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)",
                    boxShadow: "0 12px 28px -4px rgba(124, 58, 237, 0.7), 0 6px 16px -2px rgba(99, 102, 241, 0.5)",
                    transform: "translateY(-1px)",
                  },
                  "&:active": {
                    transform: "translateY(1px)",
                    boxShadow: "0 4px 12px -2px rgba(124, 58, 237, 0.4)",
                  },
                  "&.Mui-disabled": {
                    background: "rgba(255, 255, 255, 0.12)",
                    color: "rgba(255, 255, 255, 0.3)",
                  },
                }}
              >
                Login System
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLoginPage;
