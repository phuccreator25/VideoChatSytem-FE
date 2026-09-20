import { Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";

import type { AlertColor } from "@mui/material/Alert";

import useAuth from "../../hooks/Auth/auth.hook";
import type { typeRegister } from "../../types/auth.type";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    //KHÔNG KHAI BÁO ONCHANGE THÌ MẶC ĐỊNH KHI SUBMIT MỚI CHECK ERRORS
  } = useForm<typeRegister>({
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
      agree: false,
    },
  });

  const { handleRegister, typeAlert, loading, isShowAlert } = useAuth();

  const onSubmit = async (data: typeRegister) => {
    await handleRegister(data);
  };

  const password = watch("password");

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 400,
            color: "#0f172a",
            mb: 1,
          }}
        >
          Sign Up
        </Typography>
        <Typography sx={{ color: "#64748b", fontWeight: 400 }}>
          Create an account to start chatting and video calling.
        </Typography>
        {isShowAlert && (
          <Alert icon={<CheckIcon fontSize="inherit" />} severity={(typeAlert as AlertColor) || "success"}>
            Account registered successfully. Please check your email to
            activate your account.
          </Alert>
        )}
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2.2}>
          <TextField
            fullWidth
            label="Full Name"
            placeholder="Enter full name"
            {...register("fullname", {
              required: "Please enter your full name",
            })}
            error={!!errors.fullname}
            helperText={errors.fullname?.message}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            placeholder="you@example.com"
            {...register("email", {
              required: "Please enter your email",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Invalid email address",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            placeholder="Enter password"
            {...register("password", {
              required: "Please enter password",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
                  message:
                    "Password must be at least 8 characters, containing uppercase, lowercase, numbers, and special characters",
                },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            placeholder="Re-enter password"
            {...register("confirmPassword", {
              required: "Please confirm password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />

          <FormControlLabel
            control={
              <Checkbox
                {...register("agree", {
                  required: "You must agree to the terms",
                })}
              />
            }
            label="I agree to the Terms of Service and Privacy Policy"
          />

          {errors.agree && (
            <Typography sx={{ color: "error.main", fontSize: 14 }}>
              {errors.agree.message}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            loading={loading}
            sx={{
              mt: 1,
              py: 1.4,
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 500,
              boxShadow: "none",
            }}
          >
            Sign Up
          </Button>
        </Stack>
      </form>

      <Typography
        sx={{
          mt: 3,
          textAlign: "center",
          color: "#64748b",
          fontWeight: 400,
        }}
      >
        Already have an account?{" "}
        <Link
          component={RouterLink}
          to="/login"
          underline="hover"
          sx={{ fontWeight: 400, color: "#1976d2" }}
        >
          Sign In
        </Link>
      </Typography>
    </Box>
  );
}
