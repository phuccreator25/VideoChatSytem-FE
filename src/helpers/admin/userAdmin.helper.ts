export const maskEmail = (email: string): string => {
  if (!email || !email.includes("@")) return email;
  const [localPart, domain] = email.split("@");

  if (localPart.length <= 3) {
    return `${localPart[0] || ""}***@${domain}`;
  }

  const visiblePrefix = localPart.slice(0, 3);
  return `${visiblePrefix}***@${domain}`;
};

export const generateRandomPassword = () => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let gen = "aA1@";
  for (let i = 4; i < 14; i++) {
    gen += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const shuffled = gen
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");

  return { password: shuffled, confirmPassword: shuffled };
};
