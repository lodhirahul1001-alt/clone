export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeEmail = (email = "") => email.trim().toLowerCase();

export const getGmailValidationError = (email) => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return "Email is required";
  }

  if (!emailRegex.test(normalizedEmail)) {
    return "Invalid email format";
  }

  if (!normalizedEmail.endsWith("@gmail.com")) {
    return "Only Gmail allowed";
  }

  return "";
};
