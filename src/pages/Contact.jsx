import { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { EMAILJS_CONFIG } from "../config/emailjs/emailjs";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  const form = useRef(null);
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();
    if (!form.current) return;

    setIsSending(true);
    setIsSent(false);

    try {
      await emailjs.sendForm(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        form.current,
        EMAILJS_CONFIG.PUBLIC_KEY
      );
      setIsSent(true);
      form.current.reset();
    } catch (err) {
      console.error("EmailJS error:", err);
      alert("Message failed. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="glass p-6 md:p-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left info */}
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                Contact <span className="text-neon">Us</span>
              </h1>
              <p className="mt-3 text-sm md:text-base text-[color:var(--muted)] max-w-md">
                We are committed to processing the information in order to contact you and talk about your project.
              </p>

              <div className="mt-8 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5 grid place-items-center">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-[color:var(--muted)]">example@teamwebflow.com</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5 grid place-items-center">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">Address</div>
                    <div className="text-[color:var(--muted)]">4074 Ebert Summit Suite 375, Lake Leonardchester</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5 grid place-items-center">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">Phone</div>
                    <div className="text-[color:var(--muted)]">+44 123 654 7890</div>
                  </div>
                </div>
              </div>

              {isSent && (
                <div className="mt-8 rounded-xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5 px-4 py-3 text-sm">
                  ✅ Your message was sent successfully!
                </div>
              )}
            </div>

            {/* Right form */}
            <div className="glass-soft p-6 md:p-8">
              <form ref={form} onSubmit={sendEmail} className="space-y-4">
                <input
                  name="user_name"
                  type="text"
                  placeholder="Name*"
                  required
                  className="input-ui"
                />
                <input
                  name="user_email"
                  type="email"
                  placeholder="Email*"
                  required
                  className="input-ui"
                />
                <input
                  name="user_website"
                  type="text"
                  placeholder="Website"
                  className="input-ui"
                />
                <textarea
                  name="message"
                  placeholder="Message"
                  rows={6}
                  className="input-ui resize-none"
                />

                <button type="submit" className="btn-primary w-full" disabled={isSending}>
                  {isSending ? "Sending..." : "Submit"}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
