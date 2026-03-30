import { useForm } from "react-hook-form";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { fetchRegisterApi } from "../features/actions/AuthAction";
import { Mail, User, Lock, Eye, EyeOff, CircleAlert } from "lucide-react";
import { getGmailValidationError, normalizeEmail } from "../utils/emailValidation";
import { getAuthErrorFeedback } from "../utils/authError";

export default function Signup() {
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
  const fullNameField = register("fullName", { required: "Full name is required" });
  const emailField = register("email", {
    required: "Email is required",
    setValueAs: normalizeEmail,
    validate: (value) => getGmailValidationError(value) || true,
  });
  const passwordField = register("password", {
    required: "Password is required",
    minLength: { value: 6, message: "Min 6 characters" },
  });
  const passwordValue = watch("password", "");
  const fullNameHasError = Boolean(errors.fullName);
  const emailHasError = Boolean(errors.email || serverErrorFields.includes("email"));
  const passwordHasError = Boolean(errors.password || serverErrorFields.includes("password"));

  const onSubmit = async (data) => {
    clearServerFeedback();

    try {
      const res = await dispatch(fetchRegisterApi(data));
      if (res?.success) {
        navigate("/login");
        return;
      }

      setServerError("Signup failed. Please try again.");
    } catch (error) {
      console.error(error);
      const feedback = getAuthErrorFeedback(error, "signup");
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
        <div className="glass p-8 md:p-10 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-semibold">
            Create <span className="text-neon">Account</span>
          </h1>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Start distributing your music and managing everything from one dashboard.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <User className="theme-icon-muted pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
                <input
                  className={`input-ui pl-11 ${
                    fullNameHasError ? "border-red-400 bg-red-50/80 dark:bg-red-500/10" : ""
                  }`}
                  placeholder="Full name"
                  {...fullNameField}
                  onChange={(e) => {
                    clearServerFeedback();
                    fullNameField.onChange(e);
                  }}
                />
              </div>
              {errors.fullName && <p className="mt-1 text-sm text-red-400">{errors.fullName.message}</p>}
            </div>

            <div className="md:col-span-2">
              <div className="relative">
                <Mail className="theme-icon-muted pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
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
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
            </div>

            <div className="md:col-span-2">
              <div className="relative">
                <Lock className="theme-icon-muted pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
                <input
                  className={`input-ui pl-11 pr-12 ${
                    passwordHasError ? "border-red-400 bg-red-50/80 dark:bg-red-500/10" : ""
                  }`}
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
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
              {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
            </div>

            {serverError ? (
              <div className="md:col-span-2 rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                <div className="flex items-start gap-2">
                  <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{serverError}</span>
                </div>
              </div>
            ) : null}

            <div className="md:col-span-2">
              <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-sm text-[color:var(--muted)]">
            Already have an account?{" "}
            <Link to="/login" className="hover:text-[color:var(--text)] underline underline-offset-4">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
