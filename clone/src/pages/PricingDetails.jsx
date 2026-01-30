import React, { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const UPI = {
  id: "prdigitalcms@upi", // ✅ change if needed
  name: "PR DIGITAL CMS",
};

export default function PricingDetails() {
  const [params] = useSearchParams();
  const plan = params.get("plan") || "Basic";
  const billing = params.get("billing") || "monthly";

  const amount = useMemo(() => {
    // Keeping the same numbers from Pricing page
    const table = {
      monthly: { Basic: 49, Popular: 124, Pro: 299 },
      yearly: { Basic: 39, Popular: 99, Pro: 239 },
    };
    return table[billing]?.[plan] ?? 49;
  }, [billing, plan]);

  const upiUrl = useMemo(() => {
    // Standard UPI deep-link format
    const note = `${plan} Plan (${billing})`;
    const url = `upi://pay?pa=${encodeURIComponent(UPI.id)}&pn=${encodeURIComponent(
      UPI.name
    )}&am=${encodeURIComponent(String(amount))}&cu=INR&tn=${encodeURIComponent(note)}`;
    return url;
  }, [amount, billing, plan]);

  const qrSrc = useMemo(() => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiUrl)}`;
  }, [upiUrl]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const form = new FormData(e.currentTarget);
    form.set("plan", plan);
    form.set("billing", billing);
    form.set("amount", String(amount));

    const screenshot = form.get("screenshot");
    if (!screenshot || !(screenshot instanceof File) || screenshot.size === 0) {
      setError("Please upload the payment screenshot.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/payments/verify`, form, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
      e.currentTarget.reset();
    } catch (err) {
      setError(err?.response?.data?.msg || "Failed to submit verification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page pt-14 pb-24">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Payment Details – <span className="text-neon">{plan}</span>
            </h1>
            <p className="mt-2 text-[color:var(--muted)]">
              Pay via UPI and upload your screenshot + transaction id to verify.
            </p>
          </div>
          <Link to="/pricing" className="btn-ghost">
            ← Back to pricing
          </Link>
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-6 items-start">
          {/* LEFT: QR + UPI */}
          <div className="glass p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold">Scan & Pay</div>
                <div className="mt-1 text-sm text-[color:var(--muted)]">
                  Amount: <span className="text-[color:var(--text)] font-semibold">₹ {amount}</span>
                  <span className="ml-2 text-xs px-2 py-1 rounded-full bg-black/5 dark:bg-white/10">
                    {billing}
                  </span>
                </div>
                <div className="mt-3 text-sm">
                  UPI ID: <span className="text-neon font-semibold">{UPI.id}</span>
                </div>
              </div>

              <a
                className="btn-primary whitespace-nowrap"
                href={upiUrl}
                target="_blank"
                rel="noreferrer"
                title="Open UPI payment"
              >
                Pay via UPI
              </a>
            </div>

            <div className="mt-6 flex justify-center">
              <div className="glass-soft p-4 rounded-3xl">
                <img
                  src={qrSrc}
                  alt="UPI QR"
                  className="w-[260px] h-[260px] rounded-2xl"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="mt-4 text-xs text-[color:var(--muted)] leading-relaxed">
              After payment, fill the verification form on the right. Our team will approve your plan and
              activate it.
            </div>
          </div>

          {/* RIGHT: verification form */}
          <div className="glass p-6">
            <h2 className="text-lg font-semibold">Payment Verification</h2>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              Upload payment screenshot and transaction id.
            </p>

            {error && (
              <div className="mt-4 glass-soft p-3 rounded-2xl text-sm" style={{ border: "1px solid rgba(239,68,68,.35)" }}>
                {error}
              </div>
            )}
            {success && (
              <div className="mt-4 glass-soft p-3 rounded-2xl text-sm" style={{ border: "1px solid rgba(34,197,94,.35)" }}>
                Submitted! We will verify and contact you soon.
              </div>
            )}

            <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  name="fullName"
                  required
                  placeholder="Full name"
                  className="dash-input"
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email"
                  className="dash-input"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  name="phone"
                  required
                  placeholder="Phone"
                  className="dash-input"
                />
                <input
                  name="transactionId"
                  required
                  placeholder="Transaction ID"
                  className="dash-input"
                />
              </div>

              <div>
                <label className="text-sm" style={{ color: "var(--muted)" }}>
                  Upload screenshot
                </label>
                <input
                  name="screenshot"
                  type="file"
                  accept="image/*"
                  required
                  className="dash-input mt-2"
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit verification"}
              </button>
            </form>

            <div className="mt-4 text-xs text-[color:var(--muted)]">
              By submitting, you confirm that the payment details are correct.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
