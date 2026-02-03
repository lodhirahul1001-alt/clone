import { useState } from "react";
import { Link } from "react-router";
import { forgotPasswordApi } from "../apis/authApi";
import { ArrowRight } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPasswordApi(email);
      setSubmitted(true);
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.msg || "Failed to send reset link");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="glass p-8 md:p-10 w-full max-w-lg">
        <h1 className="text-3xl font-semibold">
          Reset <span className="text-neon">Password</span>
        </h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Enter your email and we’ll send instructions.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            className="input-ui"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="btn-primary w-full" type="submit">
            Send reset link <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </form>

        {submitted && (
          <div className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
            ✅ If the email exists, a reset link will be sent.
          </div>
        )}

        <div className="mt-6 text-sm text-[color:var(--muted)]">
          <Link to="/login" className="hover:text-[color:var(--text)] underline underline-offset-4">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
