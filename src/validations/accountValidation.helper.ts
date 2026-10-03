export const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export const fullnameValidationRules = {
  required: "Please enter your full name",
  minLength: {
    value: 3,
    message: "Full name must be at least 3 characters",
  },
  maxLength: {
    value: 100,
    message: "Full name cannot exceed 100 characters",
  },
};

export const usernameValidationRules = {
  minLength: {
    value: 3,
    message: "Username must be at least 3 characters",
  },
  maxLength: {
    value: 30,
    message: "Username cannot exceed 30 characters",
  },
};

export const emailValidationRules = {
  required: "Please enter your email",
  pattern: {
    value: EMAIL_REGEX,
    message: "Invalid email address",
  },
};

export const passwordValidationRules = {
  required: "Please enter password",
  minLength: {
    value: 8,
    message: "Password must be at least 8 characters long",
  },
  pattern: {
    value: PASSWORD_REGEX,
    message:
      "Password must be at least 8 characters, containing uppercase, lowercase, numbers, and special characters",
  },
};

export const agreeTermsValidationRules = {
  required: "You must agree to the terms",
};



