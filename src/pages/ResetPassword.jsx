import { useState } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router";
import { ArrowRight, Eye, EyeOff, Lock, ShieldCheck, CircleAlert } from "lucide-react";
import { AxiosIntance } from "../config/Axios.Intance";

export default function ResetPassword() {
  const { token: tokenParam } = useParams();
  const [searchParams] = useSearchParams();
  const token = tokenParam || searchParams.get("token");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isSuccess = msg.toLowerCase().includes("successfully");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!token) return setMsg("Invalid reset link. Please request a new password reset email.");
    if (!password || password.length < 6) return setMsg("Password must be at least 6 characters");
    if (password !== confirm) return setMsg("Passwords do not match");

    try {
      setLoading(true);
      await AxiosIntance.post("/auth/reset-password", { token, password });
      setMsg("Password updated successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setMsg(err?.response?.data?.msg || "Reset failed. Link may be expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10 md:py-14">
      <div className="container-page">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[1.05fr_.95fr] items-stretch">
          <div className="hidden lg:block glass p-10 relative overflow-hidden">
            <div className="absolute -top-16 -left-16 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />
            <div className="absolute -bottom-16 right-0 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-[color:var(--muted)]">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Secure password update
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight leading-tight">
                Create a fresh
                <span className="text-neon"> password</span>
              </h1>
              <p className="mt-4 max-w-md text-[color:var(--muted)]">
                Choose a strong password you have not used before so your account stays safe and easy to recover.
              </p>

              <div className="mt-8 space-y-4">
                <div className="glass-soft rounded-2xl p-4 border border-[color:var(--border)]">
                  <p className="text-sm font-medium">Password tips</p>
                  <p className="mt-1 text-sm text-[color:var(--muted)]">
                    Use at least 6 characters with a mix of letters, numbers, or symbols.
                  </p>
                </div>
                <div className="glass-soft rounded-2xl p-4 border border-[color:var(--border)]">
                  <p className="text-sm font-medium">One-time secure link</p>
                  <p className="mt-1 text-sm text-[color:var(--muted)]">
                    This page only works with the reset link sent to your email.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-8 md:p-10 rounded-[28px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
              <Lock className="h-3.5 w-3.5" />
              Account recovery
            </div>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight">
              Reset <span className="text-neon">Password</span>
            </h2>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              Enter your new password below and confirm it to finish account recovery.
            </p>

            {!token ? (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm" style={{ borderColor: "rgba(239,68,68,.35)", background: "rgba(239,68,68,.08)" }}>
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <span>Reset link is missing or invalid. Please request a new reset email.</span>
              </div>
            ) : null}

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-[color:var(--muted)]">New Password</label>
                <div className="relative">
                  <Lock className="theme-icon-muted pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
                  <input
                    className="input-ui pl-11 pr-12"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="theme-icon-button absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[color:var(--muted)]">Confirm Password</label>
                <div className="relative">
                  <ShieldCheck className="theme-icon-muted pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
                  <input
                    className="input-ui pl-11 pr-12"
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="theme-icon-button absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
                    aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {msg ? (
                <div
                  className="rounded-2xl border px-4 py-3 text-sm"
                  style={{
                    color: isSuccess ? "#86efac" : "var(--muted)",
                    borderColor: isSuccess ? "rgba(34,197,94,.35)" : "rgba(255,255,255,.12)",
                    background: isSuccess ? "rgba(34,197,94,.08)" : "rgba(255,255,255,.06)",
                  }}
                >
                  {msg}
                </div>
              ) : null}

              <button className="btn-primary w-full" disabled={loading} type="submit">
                {loading ? "Updating..." : "Update Password"} <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </form>

            <div className="mt-5 flex items-center justify-between gap-4 text-sm text-[color:var(--muted)]">
              <span>Remembered your password?</span>
              <Link className="underline underline-offset-4 hover:text-[color:var(--text)]" to="/login">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
