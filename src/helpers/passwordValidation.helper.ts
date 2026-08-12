export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  hasUppercase: (pass: string) => /[A-Z]/.test(pass),
  hasLowercase: (pass: string) => /[a-z]/.test(pass),
  hasNumber: (pass: string) => /\d/.test(pass),
  hasSpecialChar: (pass: string) => /[^A-Za-z\d]/.test(pass),
};

export const passwordValidationRules = {
  required: "Please enter a new password",
  minLength: {
    value: 8,
    message: "Password must be at least 8 characters",
  },
  pattern: {
    value: PASSWORD_REGEX,
    message: "Password must include uppercase, lowercase, numbers, and special characters",
  },
};

export const currentPasswordValidationRules = {
  required: "Please enter your current password",
};

export const validateConfirmPassword = (confirmPass: string, newPass: string) => {
  return confirmPass === newPass || "Passwords do not match";
};

// Tính độ mạnh pass
export const evaluatePasswordStrength = (pass: string) => {
  if (!pass) return { score: 0, label: "", color: "#e2e8f0" };

  let score = 0;
  if (pass.length >= 8) score += 20;
  if (PASSWORD_REQUIREMENTS.hasLowercase(pass)) score += 20;
  if (PASSWORD_REQUIREMENTS.hasUppercase(pass)) score += 20;
  if (PASSWORD_REQUIREMENTS.hasNumber(pass)) score += 20;
  if (PASSWORD_REQUIREMENTS.hasSpecialChar(pass)) score += 20;

  if (score <= 40) return { score, label: "Weak", color: "#ef4444" };
  if (score <= 60) return { score, label: "Fair", color: "#f59e0b" };
  if (score <= 80) return { score, label: "Good", color: "#3b82f6" };
  return { score, label: "Strong", color: "#10b981" };
};
