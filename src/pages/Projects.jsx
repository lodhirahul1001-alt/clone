import { motion } from "framer-motion";
import { BarChart3, CalendarClock, Fingerprint, Music2, ShieldCheck, Sparkles } from "lucide-react";

const highlights = [
  {
    title: "Release Delivery",
    description: "Upload once and deliver to Spotify, Apple Music, YouTube Music, Amazon & more.",
    icon: Music2,
  },
  {
    title: "Smart Scheduling",
    description: "Plan releases, set pre-saves, and coordinate marketing with your team.",
    icon: CalendarClock,
  },
  {
    title: "Royalty Analytics",
    description: "Track streams, territories, and earnings with real-time dashboards.",
    icon: BarChart3,
  },
];

const distributionUseCases = [
  {
    title: "Editorial Pitching",
    description: "Submit release metadata early and pitch to playlists with confidence.",
    icon: Sparkles,
  },
  {
    title: "YouTube Content ID",
    description: "Monetize user-generated videos that use your music automatically.",
    icon: Fingerprint,
  },
  {
    title: "Rights Protection",
    description: "Keep ownership and protect your catalog with store-ready delivery.",
    icon: ShieldCheck,
  },
];

export default function Projects() {
  return (
    <div className="container-page pt-14 pb-24">
      {/* Hero */}
      <div className="text-center mb-14">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-semibold tracking-tight"
        >
          Music Distribution Projects That <span className="text-neon">Scale</span>.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-4 text-[color:var(--muted)] max-w-3xl mx-auto"
        >
          A modern workflow for artists, labels, and studios — deliver music, track royalties, and manage your catalog in one place.
        </motion.p>
      </div>

      {/* Highlight cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {highlights.map((c, index) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="glass p-7 relative overflow-hidden"
            >
              <div
                className="absolute -top-24 -right-24 h-56 w-56 rounded-full opacity-40 blur-2xl"
                style={{ background: "radial-gradient(circle, var(--accent-2), transparent 60%)" }}
              />
              <div className="h-11 w-11 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 grid place-items-center">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-[color:var(--muted)] leading-relaxed">{c.description}</p>
              <button className="mt-6 btn-ghost">Learn more</button>
            </motion.div>
          );
        })}
      </div>

      {/* Use cases */}
      <div className="mt-16 glass-soft p-8 md:p-10">
        <div className="flex items-center justify-between flex-col md:flex-row gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Built for <span className="text-neon">real release workflows</span>
            </h2>
            <p className="mt-3 text-[color:var(--muted)] max-w-2xl">
              Replace scattered tools with one distribution system — metadata, delivery, royalty tracking, and catalog health checks.
            </p>
          </div>
          <button className="btn-primary">Start a release</button>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {distributionUseCases.map((c, index) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="glass p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 grid place-items-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="font-semibold">{c.title}</div>
                </div>
                <p className="mt-3 text-sm text-[color:var(--muted)] leading-relaxed">{c.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
