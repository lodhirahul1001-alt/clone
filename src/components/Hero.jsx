import { motion } from "framer-motion";
import { Play, Music2, BarChart3, Globe2 } from "lucide-react";
import Marquee from "../components/Marquee";

function EqualizerOverlay() {
  const bars = [10, 16, 8, 18, 12, 20, 9, 14, 7, 17];
  return (
    <div className="absolute bottom-4 left-4 right-4 flex items-end gap-1.5 h-12 pointer-events-none">
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className="w-1.5 rounded-full"
          style={{
            background:
              "linear-gradient(180deg,var(--accent-2),var(--accent-1))",
          }}
          animate={{
            height: [`${h / 2}px`, `${h}px`, `${h / 1.35}px`, `${h}px`],
            opacity: [0.55, 1, 0.7, 1],
          }}
          transition={{
            duration: 0.95,
            repeat: Infinity,
            repeatType: "mirror",
            delay: i * 0.06,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function VinylBadge() {
  return (
    <motion.div
      className="absolute -top- -right-5 w-20 h-20 rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      style={{
        background:
          "radial-gradient(circle at 30% 30%, rgba(255,255,255,.35), rgba(124,58,237,.35), rgba(0,0,0,.65))",
        boxShadow: "0 0 0 1px rgba(255,255,255,.08), 0 20px 60px rgba(124,58,237,.25)",
      }}
    >
      <div className="absolute inset-2 rounded-full bg-black/40" />
      <div className="absolute inset-[22px] rounded-full bg-white/10" />
      <div
        className="absolute left-1/2 top-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "var(--accent-2)" }}
      />
    </motion.div>
  );
}

export default function Hero() {
  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background blobs */}
      <div
        className="pointer-events-none absolute -top-36 -left-24 w-80 h-80 blur-3xl rounded-full opacity-60"
        style={{ background: "rgba(124,58,237,.45)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-44 right-0 w-96 h-96 blur-3xl rounded-full opacity-80"
        style={{ background: "rgba(236,72,153,.30)" }}
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 w-[34rem] h-[34rem] -translate-x-1/2 blur-3xl rounded-full opacity-35"
        style={{ background: "rgba(59,130,246,.18)" }}
      />

      {/* Subtle grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,#ffffff25_1px,transparent_0)] bg-[length:18px_18px]" />
      </div>

      {/* Gradient veil */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg,var(--heroShadeTop),var(--heroShadeMid),var(--heroShadeBottom))" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT: CONTENT */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.12 }}
            className="order-2 lg:order-1 space-y-6"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-1 rounded-full glass-soft text-xs"
            >
              <span
                className="h-1.5 w-1.5 rounded-full animate-pulse"
                style={{ background: "var(--accent-2)" }}
              />
              Built for Artists • Labels • Studios
            </motion.div>

            {/* Shine heading */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
            >
              <span className="block text-[color:var(--text)]/90">Unlimited</span>

              <span className="block relative">
                <span className="text-neon">Music Distribution</span>
                <motion.span
                  className="absolute -inset-x-6 -inset-y-2 opacity-40 blur-2xl"
                  animate={{ opacity: [0.18, 0.45, 0.18] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(124,58,237,.0), rgba(124,58,237,.6), rgba(236,72,153,.6), rgba(124,58,237,.0))",
                  }}
                />
              </span>

              <span className="block text-[color:var(--text)]/90">In One Dashboard.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="max-w-xl text-sm sm:text-base leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              Upload once, auto-deliver to every major platform. Track royalties,
              manage labels & artists, and keep 100% of your rights — designed for
              independent creators.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center gap-3"
            >
              <a href="/cms">
                <button
                  className="btn-primary relative overflow-hidden"
                  style={{
                    boxShadow:
                      "0 12px 50px rgba(124,58,237,.25), 0 0 0 1px rgba(255,255,255,.06)",
                  }}
                >
                  <span className="relative z-10">Get Your Dashboard</span>
                  <span
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(236,72,153,.2), rgba(124,58,237,.25))",
                    }}
                  />
                </button>
              </a>

              <a
                href="https://youtu.be/l9ltbUY6EaY?si=v6vtsVs-ZWGR4eMG"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="btn-ghost flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Watch Demo
                </button>
              </a>
            </motion.div>

            {/* SMALL STAT ROW */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-2">
              {[
                { icon: <Globe2 className="w-4 h-4" />, t: "190+ Countries" },
                { icon: <Music2 className="w-4 h-4" />, t: "150+ Platforms" },
                { icon: <BarChart3 className="w-4 h-4" />, t: "Live Royalties" },
              ].map((x) => (
                <div
                  key={x.t}
                  className="glass-soft px-3 py-2 rounded-xl text-xs flex items-center gap-2"
                  style={{ border: "1px solid var(--dash-border)" }}
                >
                  <span style={{ color: "var(--accent-2)" }}>{x.icon}</span>
                  <span className="text-[color:var(--text)]/80">{x.t}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT: VIDEO */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative glass p-3 sm:p-4 rounded-3xl overflow-hidden">
              {/* Glow border */}
              <div
                className="pointer-events-none absolute -inset-1 rounded-3xl opacity-50 blur-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(124,58,237,.45), rgba(236,72,153,.35), rgba(59,130,246,.25))",
                }}
              />

              <div className="w-full aspect-[16/10] overflow-hidden rounded-2xl">
                {/*
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/7hRLOkORUDo?autoplay=1&mute=1&loop=1&playlist=7hRLOkORUDo&controls=0&showinfo=0&modestbranding=1"
                  title="Music Preview"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
                */}

                <img
                  src="/homeimage.jpeg"
                  alt="Music distribution dashboard preview"
                  className="w-full h-full object-cover"
                />
              </div>


              {/* Platform chips + hover lift */}
              <div className="mt-4 flex flex-wrap gap-2">
                {["Spotify", "Apple Music", "JioSaavn", "Gaana", "YouTube Music"].map(
                  (p) => (
                    <motion.span
                      key={p}
                      whileHover={{ y: -2, scale: 1.02 }}
                      className="px-3 py-1 rounded-full text-[11px] glass cursor-default"
                      style={{ border: "1px solid var(--dash-border)" }}
                    >
                      {p}
                    </motion.span>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Marquee */}
        {/* <div className="mt-14">
          <Marquee />
        </div> */}
      </div>
    </section>
  );
}
