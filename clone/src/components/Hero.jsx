import React, { useRef, useState } from "react";
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

const VIDEO_SRC =
  "https://videos.pexels.com/video-files/6945625/6945625-hd_1920_1080_30fps.mp4";

function VideoCard({ minimal = false }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = async () => {
    const v = ref.current;
    if (!v) return;
    try {
      if (v.paused) {
        await v.play();
        setPlaying(true);
      } else {
        v.pause();
        setPlaying(false);
      }
    } catch {
      // ignore autoplay/play errors
    }
  };

  return (
    <div className={minimal ? "glass p-3 sm:p-4 rounded-3xl" : "glass p-3 sm:p-4 rounded-3xl"}>
      <div className="relative rounded-2xl overflow-hidden">
        <video
          ref={ref}
          className="w-full aspect-[16/10] object-cover"
          src={VIDEO_SRC}
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

        <button
          type="button"
          onClick={toggle}
          className="absolute inset-0 grid place-items-center"
          aria-label={playing ? "Pause video" : "Play video"}
        >
          <span
            className="h-14 w-14 rounded-full grid place-items-center"
            style={{
              background: "rgba(0,0,0,.35)",
              border: "1px solid rgba(255,255,255,.22)",
              boxShadow: "0 18px 50px rgba(0,0,0,.35)",
            }}
          >
            <Play className="w-6 h-6" style={{ color: "white" }} />
          </span>
        </button>

        <div className="absolute top-3 left-3 inline-flex items-center gap-2 px-3 py-1 rounded-full glass-soft text-xs">
          <span
            className="h-1.5 w-1.5 rounded-full animate-pulse"
            style={{ background: "var(--accent-2)" }}
          />
          Watch how it works
        </div>

        {!minimal && <EqualizerOverlay />}
      </div>

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
  );
}

function HeroLight() {
  return (
    <section className="relative overflow-hidden">
      {/* Minimal glow (light theme) */}
      <div
        className="pointer-events-none absolute -top-28 -left-24 w-64 h-64 blur-3xl rounded-full opacity-50"
        style={{ background: "rgba(124,58,237,.22)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 right-0 w-72 h-72 blur-3xl rounded-full opacity-40"
        style={{ background: "rgba(236,72,153,.16)" }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* LEFT: TEXT */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-soft text-xs">
              <span
                className="h-1.5 w-1.5 rounded-full animate-pulse"
                style={{ background: "var(--accent-2)" }}
              />
              Built for Artists & Labels
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              <span className="block">Unlimited</span>
              <span className="block text-neon">Music Distribution</span>
              <span className="block">in one dashboard.</span>
            </h1>

            <p className="max-w-xl text-sm sm:text-base" style={{ color: "var(--muted)" }}>
              Upload once, auto-deliver to every major platform. Track royalties,
              manage labels & artists, and keep 100% of your rights — designed for
              studios and independent creators.
            </p>

            <div className="flex flex-wrap items-center gap-3">
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
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-md">
              {[
                { k: "10K+", v: "Releases" },
                { k: "190+", v: "Countries" },
                { k: "100%", v: "Rights stay with you" },
              ].map((x) => (
                <div
                  key={x.v}
                  className="glass-soft p-3 rounded-2xl"
                  style={{ border: "1px solid var(--border)" }}
                >
                  <div className="text-base font-semibold">{x.k}</div>
                  <div className="text-[11px]" style={{ color: "var(--muted)" }}>
                    {x.v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: VIDEO */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <VideoCard minimal />
          </motion.div>
        </div>

        <div className="mt-12">
          <Marquee />
        </div>
      </div>
    </section>
  );
}

function HeroDark() {
  return (
    <section className="relative overflow-hidden">
      {/* Rich glow (dark theme) */}
      <div
        className="pointer-events-none absolute -top-36 -left-24 w-72 h-72 blur-3xl rounded-full opacity-60"
        style={{ background: "rgba(124,58,237,.50)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-44 right-0 w-80 h-80 blur-3xl rounded-full opacity-55"
        style={{ background: "rgba(236,72,153,.35)" }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,#ffffff25_1px,transparent_0)] bg-[length:18px_18px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* LEFT: TEXT */}
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

            {/* Animated insight cards (dark version) */}
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

          {/* RIGHT: VIDEO */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <VideoCard />
          </motion.div>
        </div>

        <div className="mt-15 w-screen" >
          <Marquee />
        </div>
      </div>
    </section>
  );
}

export default function Hero() {
  return (
    <>
      {/* 2 hero versions: light theme + dark theme */}
      <div className="dark:hidden">
        <HeroLight />
      </div>
      <div className="hidden dark:block">
        <HeroDark />
      </div>
    </>
  );
}
