const includesAny = (value, checks) => checks.some((check) => value.includes(check));

export const extractApiErrorMessage = (
  error,
  fallback = "Something went wrong. Please try again."
) => {
  const data = error?.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data.trim();
  }

  return data?.msg || data?.message || data?.error || fallback;
};

export const getAuthErrorFeedback = (error, flow = "login") => {
  const status = error?.response?.status;
  const fallback =
    flow === "signup"
      ? "Signup failed. Please try again."
      : "Login failed. Please try again.";
  const message = extractApiErrorMessage(error, fallback);
  const normalizedMessage = message.toLowerCase();

  if (flow === "login") {
    if (
      includesAny(normalizedMessage, [
        "user not found",
        "email not found",
        "account not found",
        "no user",
      ])
    ) {
      return {
        message: "No account found with this email.",
        fields: ["email"],
        focusField: "email",
      };
    }

    if (
      status === 401 ||
      includesAny(normalizedMessage, [
        "invalid credential",
        "invalid credentials",
        "incorrect password",
        "wrong password",
        "incorrect email",
        "wrong email",
        "password is incorrect",
        "password doesn't match",
      ])
    ) {
      return {
        message: "Incorrect email or password.",
        fields: ["email", "password"],
        focusField: "email",
      };
    }

    if (includesAny(normalizedMessage, ["email"])) {
      return {
        message,
        fields: ["email"],
        focusField: "email",
      };
    }

    if (includesAny(normalizedMessage, ["password"])) {
      return {
        message,
        fields: ["password"],
        focusField: "password",
      };
    }
  }

  if (
    status === 409 ||
    includesAny(normalizedMessage, [
      "already exists",
      "already registered",
      "user exists",
      "account exists",
      "email already",
      "duplicate",
      "user already",
      "already in use",
    ])
  ) {
    return {
      message: "This email is already registered. Please log in instead.",
      fields: ["email"],
      focusField: "email",
    };
  }

  if (includesAny(normalizedMessage, ["email"])) {
    return {
      message,
      fields: ["email"],
      focusField: "email",
    };
  }

  if (includesAny(normalizedMessage, ["password"])) {
    return {
      message,
      fields: ["password"],
      focusField: "password",
    };
  }

  return {
    message,
    fields: [],
    focusField: undefined,
  };
};
