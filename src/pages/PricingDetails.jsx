import React, { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const UPI = {
  id: "prdigitalcms@upi", // ✅ change if needed
  name: "Silent Music Group",
};

export default function PricingDetails() {
  const [params] = useSearchParams();
  const plan = params.get("plan") || "Basic";
  const billing = params.get("billing") || "yearly";

  const amount = useMemo(() => {
    // Keeping the same numbers from Pricing page
    const table = {
      // monthly: { Basic: 4999, Popular: 124, Pro: 299 },
      yearly: { Basic: 35, Popular: 99, Pro: 239 },
    };
    return table[billing]?.[plan] ?? 4999;
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
  const [showForm, setShowForm] = useState(false);
  const [copied, setCopied] = useState(false);

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
        <div className="flex items-center justify-between flex-wrap ">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Secure Checkout</h1>
            <p className="mt-2 text-[color:var(--muted)]">
              Complete your purchase to enroll in this plan.
            </p>
          </div>
          <Link to="/pricing" className="btn-ghost">
            ← Back to pricing
          </Link>
        </div>

        <div className="mt-15 grid lg:grid-cols-1 justify-self-center bg-transparent gap-6 items-start">
          {/* LEFT: choose payment method */}
          <div className="glass justify-between  p-6">
            <h2 className="text-lg justify-self-center text-neon  font-semibold">Choose Payment Method</h2>
            <p className="mt-5 text-l justify-center ml-25 text-[color:var(--muted)]">
              Plan: <span className="text-neon mt-6 font-semibold">{plan}</span>
              <span className="ml-2 mt-9 text-xs px-2 py-1 rounded-full bg-black/5 dark:bg-white/10">Yearly</span>
              <span className="ml-2 text-xs px-2 py-1 rounded-full bg-black/5 dark:bg-white/10">₹ {amount}</span>
            </p>
{/* 
            <div className="mt-6 glass-soft p-4 rounded-3xl">
              <div className="text-sm font-semibold">UPI Payment</div>
              <div className="mt-2 flex items-center justify-between gap-3 flex-wrap">
                <div className="text-sm" style={{ color: "var(--muted)" }}>
                  Google Pay, PhonePe, Paytm, BHIM
                </div>
                <a className="btn-primary" href={upiUrl} target="_blank" rel="noreferrer">
                  Proceed to Pay
                </a>
              </div>
            </div> */}

            <div className="mt-6 text-xs text-[color:var(--muted)] leading-relaxed">
              {/* 100% secure manual verification • Once done, click <span className="text-[color:var(--text)] font-semibold">I have completed payment</span> to submit details. */}
            </div>
          </div>

          {/* RIGHT: UPI modal style + confirmation form */}
          <div className="glass p-6">
            {!showForm ? (
              <>
                <div className="text-lg font-semibold">UPI Payment</div>

                <div className="mt-4 flex justify-center">
                  {/* <div className="glass-soft p-4 rounded-3xl">
                    <img
                      src={qrSrc}
                      alt="UPI QR"
                      className="w-[240px] h-[240px] rounded-2xl"
                      loading="lazy"
                    />
                  </div> */}
                  <div className="bg-white p-4 rounded-3xl shadow-lg">
<QRCodeCanvas
  value={upiUrl}
  size={240}
  bgColor="#ffffff"
  fgColor="#000000"
  level="H"   // logo ke liye important
  includeMargin={true}
  imageSettings={{
    src: "/gpay.png",   // 👈 public folder path
    height: 300,
    width: 300,
    excavate: true,
  }}

  />
</div>
                </div>

              

                <button
                  type="button"
                  className="btn-ghost w-full mt-4"
                  onClick={() => setShowForm(true)}
                >
                  I have completed payment
                </button>

                <Link
                  to="/support"
                  className="btn-ghost w-full mt-2 text-center"
                >
                  Raise a ticket
                </Link>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold">Payment Confirmation</h2>
                <p className="mt-1 text-sm text-[color:var(--muted)]">
                  Fill your details and upload payment screenshot for verification.
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
                  name="whatsapp"
                  required
                  placeholder="WhatsApp no"
                  className="dash-input"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  name="transactionId"
                  required
                  placeholder="Transaction ID"
                  className="dash-input"
                />
                <input
                  name="upiId"
                  defaultValue={UPI.id}
                  placeholder="Your UPI ID (optional)"
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

              <button
                type="button"
                className="btn-ghost w-full"
                onClick={() => setShowForm(false)}
              >
                Back
              </button>
            </form>

            <div className="mt-4 text-xs text-[color:var(--muted)]">
              By submitting, you confirm that the payment details are correct.
            </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
