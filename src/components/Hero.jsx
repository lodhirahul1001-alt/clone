import { motion } from "framer-motion";
import { Play, Music2, BarChart3, Globe2 } from "lucide-react";
import Marquee from "../components/Marquee";

function EqualizerOverlay() {
  const bars = [10, 16, 8, 18, 12, 20, 9, 14, 7, 17];
  return (
    <div className="absolute bottom-3 left-3 right-3 flex items-end gap-1.5 h-10 pointer-events-none">
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className="w-1.5 rounded-full"
          style={{
            background: "linear-gradient(180deg,var(--accent-2),var(--accent-1))",
          }}
          animate={{
            height: [`${h / 2}px`, `${h}px`, `${h / 1.3}px`, `${h}px`],
            opacity: [0.65, 1, 0.75, 1],
          }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            repeatType: "mirror",
            delay: i * 0.08,
          }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  // Free stock video (Pexels). If it ever fails, the UI still looks good without it.
  const videoSrc =
    "https://videos.pexels.com/video-files/6945625/6945625-hd_1920_1080_30fps.mp4";

  return (
    <section className="relative overflow-hidden">
      {/* Glowing blobs */}
      <div
        className="pointer-events-none absolute -top-32 -left-20 w-64 h-64 blur-3xl rounded-full opacity-60"
        style={{ background: "rgba(124,58,237,.45)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 right-0 w-72 h-72 blur-3xl rounded-full opacity-50"
        style={{ background: "rgba(236,72,153,.35)" }}
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 w-80 h-80 -translate-x-1/2 blur-3xl rounded-full opacity-40"
        style={{ background: "rgba(59,130,246,.18)" }}
      />

      {/* Subtle grid overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,#ffffff25_1px,transparent_0)] bg-[length:18px_18px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* LEFT: VIDEO */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="glass p-3 sm:p-4 rounded-3xl overflow-hidden relative">
              <div className="relative rounded-2xl overflow-hidden">
                <video
                  className="w-full aspect-[16/10] object-cover"
                  src={videoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Tiny "now playing" chip */}
                <div className="absolute top-3 left-3 inline-flex items-center gap-2 px-3 py-1 rounded-full glass-soft text-xs">
                  <span
                    className="h-1.5 w-1.5 rounded-full animate-pulse"
                    style={{ background: "var(--accent-2)" }}
                  />
                  Now distributing
                </div>

                <EqualizerOverlay />
              </div>

              {/* mini platform chips */}
              <div className="mt-4 flex flex-wrap gap-2">
                {["Spotify", "Apple Music", "JioSaavn", "Gaana", "YouTube Music"].map((p) => (
                  <span
                    key={p}
                    className="px-3 py-1 rounded-full text-[11px] glass"
                    style={{ border: "1px solid var(--dash-border)" }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT: CONTENT + ANIMATED CARDS */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-soft text-xs"
            >
              <span
                className="h-1.5 w-1.5 rounded-full animate-pulse"
                style={{ background: "var(--accent-2)" }}
              />
              Built for Artists & Labels
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
            >
              <span className="block">Unlimited</span>
              <span className="block text-neon">Music Distribution</span>
              <span className="block">in one dashboard.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="max-w-xl text-sm sm:text-base"
              style={{ color: "var(--muted)" }}
            >
              Upload once, auto-deliver to every major platform. Track royalties,
              manage labels & artists, and keep 100% of your rights — designed for
              studios and independent creators.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-wrap items-center gap-3"
            >
              <a href="/cms">
                <button className="btn-primary">Get Your Dashboard</button>
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

            {/* Animated insight cards */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="grid sm:grid-cols-2 gap-4 pt-2"
            >
              <div className="glass-soft p-4 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
                    <BarChart3 className="w-4 h-4" style={{ color: "var(--accent-1)" }} />
                    Revenue pulse
                  </div>
                  <span className="text-[11px]" style={{ color: "var(--accent-1)" }}>
                    Live
                  </span>
                </div>
                <div className="mt-3 flex items-end gap-1.5 h-10">
                  {[6, 12, 18, 10, 16, 8, 14, 9].map((h, idx) => (
                    <motion.span
                      key={idx}
                      className="w-1.5 rounded-full"
                      style={{
                        background:
                          "linear-gradient(180deg,var(--accent-2),var(--accent-1))",
                      }}
                      animate={{ height: [`${h / 2}px`, `${h}px`, `${h / 1.4}px`, `${h}px`] }}
                      transition={{
                        duration: 1.05,
                        repeat: Infinity,
                        repeatType: "mirror",
                        delay: idx * 0.1,
                      }}
                    />
                  ))}
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <div>
                    <div className="text-[11px]" style={{ color: "var(--muted)" }}>
                      This month
                    </div>
                    <div className="text-lg font-semibold">₹ 1,24,500</div>
                  </div>
                  <div
                    className="px-3 py-1 rounded-full text-[11px]"
                    style={{ background: "rgba(124,58,237,.12)", color: "var(--accent-1)" }}
                  >
                    +32%
                  </div>
                </div>
              </div>

              <div className="glass-soft p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
                  <Globe2 className="w-4 h-4" style={{ color: "var(--accent-2)" }} />
                  Global reach
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    { k: "190+", v: "Countries" },
                    { k: "25+", v: "DSPs" },
                    { k: "10K+", v: "Releases" },
                    { k: "24/7", v: "Support" },
                  ].map((x) => (
                    <div key={x.v} className="glass p-3 rounded-xl" style={{ border: "1px solid var(--dash-border)" }}>
                      <div className="text-base font-semibold">{x.k}</div>
                      <div className="text-[11px]" style={{ color: "var(--muted)" }}>
                        {x.v}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px]" style={{ color: "var(--muted)" }}>
                  <Music2 className="w-3.5 h-3.5" />
                  Spotify, Apple Music, JioSaavn, YouTube Music & more
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Logo marquee */}
        <div className="mt-12">
          <Marquee />
        </div>
      </div>
    </section>
  );
}
