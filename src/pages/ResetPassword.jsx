import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import { AxiosIntance } from "../config/Axios.Intance";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
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
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-14">
      <div className="glass max-w-md w-full p-6 md:p-8">
        <h1 className="text-2xl font-semibold">Reset Password</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          Create a new password for your account.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm" style={{ color: "var(--muted)" }}>New Password</label>
            <input
              className="input mt-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>

          <div>
            <label className="text-sm" style={{ color: "var(--muted)" }}>Confirm Password</label>
            <input
              className="input mt-2"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>

          {msg ? <div className="text-sm" style={{ color: "var(--muted)" }}>{msg}</div> : null}

          <button className="btn-primary w-full" disabled={loading} type="submit">
            {loading ? "Updating..." : "Update Password"} <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </form>

        <div className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
          Back to <Link className="underline" to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
