import React, { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { AxiosIntance } from "../config/Axios.Intance";


import { postFormEntryToGoogleSheet } from "../utils/googleSheetsSync";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function CallbackModal({ open, onClose }) {
  const dialogRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setSuccess(false);
      setError("");
      dialogRef.current?.showModal?.();
    } else {
      dialogRef.current?.close?.();
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const form = e.currentTarget;
    const payload = {
      name: form.name.value,
      phone: form.phone.value,
      preferredTime: form.time.value,
      enquiryFor: form.enquiry.value,
      email: form.email?.value || "",
    };

    setLoading(true);
    try {
      await AxiosIntance.post('/callbacks/create', payload);
      try {
        if (SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY) {
          await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
            name: payload.name,
            phone: payload.phone,
            time: payload.preferredTime,
            enquiry: payload.enquiryFor,
            email: payload.email,
          }, { publicKey: PUBLIC_KEY });
        }
      } catch (err) { console.error('EmailJS error:', err); }

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, payload, { publicKey: PUBLIC_KEY });

      void postFormEntryToGoogleSheet({
        formType: "callback-modal",
        formTitle: "Callback Request Form",
        data: payload,
        status: "submitted",
        userInfo: {
          name: payload.name,
        },
      });
      
      void postFormEntryToGoogleSheet({ formType: 'callback-modal', formTitle: 'Callback Request Form', data: payload, status: 'submitted', userInfo: { name: payload.name } });
      setSuccess(true);
      form.reset();
    } catch (err) {
      setError(err?.response?.data?.msg || 'Could not send. Please try again.');
      console.error('Callback error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog ref={dialogRef} className="bg-transparent p-0 max-w-none" onClose={onClose}>
      <div className="fixed inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="glass w-full max-w-md relative p-6 rounded-3xl text-[color:var(--text)]">
          <button type="button" onClick={onClose} className="absolute right-4 top-4 h-9 w-9 rounded-full grid place-items-center bg-black/5 dark:bg-white/10" aria-label="Close">✕</button>
          <h3 className="text-2xl font-semibold text-[color:var(--text)]">Request a callback</h3>
          <p className="mt-1 text-sm text-[color:var(--muted)]">Fill the form below and our team will contact you.</p>
          {error && <div className="mt-4 glass-soft p-3 rounded-2xl text-sm" style={{ border: '1px solid rgba(239,68,68,.35)' }}>{error}</div>}
          {success && <div className="mt-4 glass-soft p-3 rounded-2xl text-sm" style={{ border: '1px solid rgba(34,197,94,.35)' }}>Submitted! We will contact you soon.</div>}
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <div><label className="text-sm text-[color:var(--muted)]">Name</label><input name="name" required placeholder="Enter your name" className="dash-input mt-2" /></div>
            <div><label className="text-sm text-[color:var(--muted)]">Phone</label><input name="phone" required placeholder="Enter phone number" className="dash-input mt-2" /></div>
            <div><label className="text-sm text-[color:var(--muted)]">Email</label><input name="email" type="email" placeholder="Enter email (optional)" className="dash-input mt-2" /></div>
            <div><label className="text-sm text-[color:var(--muted)]">When should we call you?</label><input name="time" type="datetime-local" required className="dash-input mt-2" /></div>
            <div><label className="text-sm text-[color:var(--muted)]">Enquiry For</label><select name="enquiry" className="dash-input mt-2" defaultValue="Online Courses (Website)"><option>Online Courses (Website)</option><option>Music Distribution</option><option>Label / Sub Label</option><option>Support</option></select></div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
