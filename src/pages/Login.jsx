import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { loginUserApi } from "../features/actions/AuthAction";
import { CircleAlert, Eye, EyeOff, Lock, User } from "lucide-react";
import { useState } from "react";
import { getGmailValidationError, normalizeEmail } from "../utils/emailValidation";
import { getAuthErrorFeedback } from "../utils/authError";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [serverErrorFields, setServerErrorFields] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setFocus,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const clearServerFeedback = () => {
    setServerError("");
    setServerErrorFields([]);
  };
  const emailField = register("email", {
    required: "Email is required",
    setValueAs: normalizeEmail,
    validate: (value) => getGmailValidationError(value) || true,
  });
  const passwordField = register("password", { required: "Password is required" });
  const passwordValue = watch("password", "");
  const emailHasError = Boolean(errors.email || serverErrorFields.includes("email"));
  const passwordHasError = Boolean(errors.password || serverErrorFields.includes("password"));

  const onSubmit = async (data) => {
    clearServerFeedback();

    try {
      const res = await dispatch(loginUserApi(data));
      if (res?.success) {
        navigate("/user-dashboard");
        return;
      }

      setServerError("Login failed. Please try again.");
    } catch (error) {
      console.error(error);
      const feedback = getAuthErrorFeedback(error, "login");
      setServerError(feedback.message);
      setServerErrorFields(feedback.fields);
      if (feedback.focusField) {
        setFocus(feedback.focusField);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left welcome */}
          <div className="hidden lg:block glass p-10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-60 pointer-events-none" />
            <h1 className="text-5xl font-semibold tracking-tight">
              Welcome<span className="text-neon">!</span>
            </h1>
            <p className="mt-4 text-[color:var(--muted)] max-w-md">
              Sign in to access your dashboard, releases, analytics and payouts.
            </p>
            <div className="mt-8">
              <Link to="/" className="btn-ghost">
                Learn more
              </Link>
            </div>
          </div>

          {/* Right form */}
          <div className="glass p-8 md:p-10">
            <h2 className="text-2xl font-semibold mb-1">Sign in</h2>
            <p className="text-sm text-[color:var(--muted)] mb-6">
              Use your email and password to continue.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <div className="relative">
                  <User className="theme-icon-muted pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
                  <input
                    className={`input-ui pl-11 ${
                      emailHasError ? "border-red-400 bg-red-50/80 dark:bg-red-500/10" : ""
                    }`}
                    placeholder="Email"
                    type="email"
                    {...emailField}
                    onChange={(e) => {
                      clearServerFeedback();
                      emailField.onChange(e);
                    }}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Lock className="theme-icon-muted pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
                  <input
                    className={`input-ui pl-11 pr-12 ${
                      passwordHasError ? "border-red-400 bg-red-50/80 dark:bg-red-500/10" : ""
                    }`}
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    {...passwordField}
                    value={passwordValue}
                    onChange={(e) => {
                      clearServerFeedback();
                      passwordField.onChange(e);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="theme-icon-button absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
                )}
              </div>

              {serverError ? (
                <div className="rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                  <div className="flex items-start gap-2">
                    <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{serverError}</span>
                  </div>
                </div>
              ) : null}

              <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Signing in..." : "Submit"}
              </button>

              <div className="flex items-center justify-between text-sm text-[color:var(--muted)]">
                <Link to="/forgot-password" className="hover:text-[color:var(--text)]">
                  Forgot password?
                </Link>
                <Link to="/signup" className="hover:text-[color:var(--text)]">
                  Create account
                </Link>
              </div>
            </form>

            <div className="mt-6 text-xs text-[color:var(--muted)]">
              By continuing you agree to our Terms & Privacy Policy.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
