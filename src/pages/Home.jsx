import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Globe2,
  Music2,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react";

import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import VideoFooter from "../components/VideoFooter";
import TeamSection from "../components/TeamSection";

function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="relative py-16 md:py-20">
      <div className="container-page">
        <div className="mb-10">
          <h2 className="section-title">
            <span className="text-neon">{title}</span>
          </h2>
          {subtitle ? (
            <p className="mt-3 text-sm md:text-base" style={{ color: "var(--muted)" }}>
              {subtitle}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}

export default function Home() {
  const [featureTab, setFeatureTab] = useState("analytics");
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [activeInsight, setActiveInsight] = useState(null);

  const stats = useMemo(
    () => [
      { value: "10k+", label: "Active Artists" },
      { value: "500+", label: "Labels & Partners" },
      { value: "99.9%", label: "Delivery Success" },
      { value: "24/7", label: "Dedicated Support" },
    ],
    []
  );

  const steps = useMemo(
    () => [
      {
        n: "01",
        title: "Create your account",
        desc: "Sign up in minutes and set up your label / artist profile.",
      },
      {
        n: "02",
        title: "Upload your release",
        desc: "Music + artwork + metadata. We validate everything instantly.",
      },
      {
        n: "03",
        title: "Distribute worldwide",
        desc: "Deliver to DSPs, stores and social platforms in one click.",
      },
      {
        n: "04",
        title: "Track & earn",
        desc: "Monitor analytics, royalties and performance from your dashboard.",
      },
    ],
    []
  );

  const features = useMemo(
    () => ({
      analytics: {
        label: "Advanced Analytics",
        icon: BarChart3,
        title: "Real‑time dashboards for artists & labels",
        bullets: [
          "Streaming & download insights",
          "Top territories & playlists",
          "Revenue tracking & export",
        ],
      },
      automation: {
        label: "Intelligent Automation",
        icon: Wand2,
        title: "Automate delivery, takedowns & updates",
        bullets: [
          "Metadata validation",
          "Auto‑deliver to supported DSPs",
          "Fast edits & re‑distribution",
        ],
      },
      collaboration: {
        label: "Team Collaboration",
        icon: Sparkles,
        title: "Invite your team and manage catalogs together",
        bullets: [
          "Roles & permissions",
          "Artist / label workspace",
          "Approval flows",
        ],
      },
      security: {
        label: "Enterprise Security",
        icon: ShieldCheck,
        title: "Protect content, rights and access",
        bullets: [
          "Secure uploads",
          "Rights‑first workflows",
          "Audit friendly activity logs",
        ],
      },
    }),
    []
  );

  const testimonials = useMemo(
    () => [
      {
        name: "Sarah Johnson",
        role: "Independent Artist",
        quote:
          "PR DIGITAL CMS made distribution simple. The dashboard is beautiful and the analytics actually help me plan my next release.",
        stars: 5,
        avatar:
          "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=220",
      },
      {
        name: "Aman Verma",
        role: "Label Manager",
        quote:
          "One place to manage multiple artists, releases and updates. Fast support and smooth delivery to stores.",
        stars: 5,
        avatar:
          "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=220",
      },
      {
        name: "Neha Singh",
        role: "Producer",
        quote:
          "The workflow is clean: upload, distribute, track. Love the dark theme and the performance stats.",
        stars: 5,
        avatar:
          "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=220",
      },
    ],
    []
  );

  const insights = useMemo(
    () => [
      {
        tag: "Distribution",
        date: "May 15, 2025",
        read: "5 min read",
        title: "10 Ways to grow streams after release day",
        desc:
          "Practical promotion steps that work for independent artists and labels.",
        img: "https://images.pexels.com/photos/164745/pexels-photo-164745.jpeg?auto=compress&cs=tinysrgb&w=900",
      },
      {
        tag: "Royalties",
        date: "Apr 28, 2025",
        read: "4 min read",
        title: "How to read royalty reports like a pro",
        desc:
          "Understand revenue sources, territories, and payout schedules.",
        img: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=900",
      },
      {
        tag: "Strategy",
        date: "Apr 12, 2025",
        read: "7 min read",
        title: "Building a release strategy that scales",
        desc:
          "From singles to albums: timing, assets and campaign basics.",
        img: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=900",
      },
    ],
    []
  );

  const activeFeature = features[featureTab];
  const ActiveIcon = activeFeature.icon;
  const t = testimonials[testimonialIndex];

  return (
    <div>
      {/* HERO */}
      <Hero />

      {/* SHOWCASE MARQUEE (fixed) */}
      <Marquee />

      {/* JOIN THOUSANDS */}
<<<<<<< HEAD
      <Section
=======
      {/* <Section
>>>>>>> 649e8b6 (fix all)
        id="trust"
        title="Join thousands of satisfied customers"
        subtitle="Trusted by artists, labels and studios across regions."
      >
        <div className="grid gap-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="glass p-6">
              <div className="text-3xl font-semibold" style={{ color: "var(--text)" }}>
                {s.value}
              </div>
              <div className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 glass-soft p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl grid place-items-center"
              style={{
                background: "linear-gradient(90deg, var(--accent-1), var(--accent-2))",
                color: "white",
              }}
            >
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold">Global distribution made simple</div>
              <div className="text-sm" style={{ color: "var(--muted)" }}>
                Deliver to major platforms and track everything in one place.
              </div>
            </div>
          </div>

          <a href="/signup" className="btn-primary w-full md:w-auto">
            Get Started <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </div>
<<<<<<< HEAD
      </Section>
=======
      </Section> */}
>>>>>>> 649e8b6 (fix all)

      {/* HOW IT WORKS */}
      <Section id="how" title="How It Works" subtitle="Simple four‑step process">
        <div className="grid gap-6 md:grid-cols-4">
          {steps.map((step) => (
            <div key={step.n} className="glass overflow-hidden">
              <div
                className="px-5 py-4 flex items-center justify-between"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(124,58,237,.18), rgba(236,72,153,.12))",
                }}
              >
                <div className="text-xs tracking-widest" style={{ color: "var(--muted)" }}>
                  {step.n}
                </div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              <div className="p-5">
                <div className="font-semibold">{step.title}</div>
                <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* POWERFUL FEATURES */}
      <Section
        id="features"
        title="Powerful Features"
        subtitle="Everything you need to streamline releases and workflow"
      >
        <div className="glass p-5 md:p-7">
          <div className="flex flex-wrap gap-2">
            {Object.entries(features).map(([key, f]) => {
              const Icon = f.icon;
              const active = key === featureTab;
              return (
                <button
                  key={key}
                  onClick={() => setFeatureTab(key)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all ${
                    active ? "btn-primary" : "btn-ghost"
                  }`}
                  type="button"
                >
                  <Icon className="w-4 h-4" />
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-2 items-center">
            <div>
              <div className="flex items-center gap-3">
                <div
                  className="h-11 w-11 rounded-2xl grid place-items-center"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--accent-1), var(--accent-2))",
                    color: "white",
                  }}
                >
                  <ActiveIcon className="w-5 h-5" />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold">{activeFeature.title}</h3>
              </div>
              <ul className="mt-4 space-y-3">
                {activeFeature.bullets.map((b) => (
                  <li key={b} className="flex gap-2 items-start text-sm" style={{ color: "var(--muted)" }}>
                    <CheckCircle2 className="w-4 h-4 mt-0.5" style={{ color: "var(--accent-1)" }} />
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex gap-3 flex-wrap">
                <a href="/services" className="btn-ghost">See More</a>
                <a href="/signup" className="btn-primary">Start Free</a>
              </div>
            </div>

            {/* Illustration panel */}
            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl blur-2xl opacity-60"
                style={{
                  background:
                    "radial-gradient(600px 240px at 60% 20%, rgba(124,58,237,.45), transparent 60%), radial-gradient(500px 220px at 40% 80%, rgba(236,72,153,.35), transparent 60%)",
                }}
              />
              <div className="relative glass p-6 md:p-7 overflow-hidden">
                <div className="text-sm font-semibold">Dashboard preview</div>
                <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                  A clean, modern interface that keeps everything in one place.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  {["Streams", "Revenue", "Top Cities"].map((k) => (
                    <div key={k} className="glass-soft p-4">
                      <div className="text-xs" style={{ color: "var(--muted)" }}>{k}</div>
                      <div className="mt-2 text-lg font-semibold">{k === "Streams" ? "16.1k" : k === "Revenue" ? "₹12.5k" : "Delhi"}</div>
                      <div className="mt-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,.10)" }}>
                        <div className="h-2 rounded-full" style={{ width: "68%", background: "linear-gradient(90deg,var(--accent-1),var(--accent-2))" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section
        id="testimonials"
        title="What Our Customers Say"
        subtitle="Don't just take our word for it — hear from our satisfied customers."
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] items-center">
          <div className="glass p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 md:items-center">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-2 rounded-full blur-xl opacity-60"
                    style={{ background: "linear-gradient(90deg,var(--accent-1),var(--accent-2))" }}
                  />
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="relative h-16 w-16 rounded-full object-cover border"
                    style={{ borderColor: "var(--border)" }}
                    loading="lazy"
                  />
                </div>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm" style={{ color: "var(--muted)" }}>{t.role}</div>
                  <div className="mt-2 text-sm" style={{ color: "#fbbf24" }}>
                    {"★★★★★".slice(0, t.stars)}
                  </div>
                </div>
              </div>

              <div className="md:pl-6 md:border-l" style={{ borderColor: "var(--border)" }}>
                <p className="text-base md:text-lg italic" style={{ color: "var(--text)" }}>
                  “{t.quote}”
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              type="button"
              className="btn-ghost h-10 w-10 px-0"
              onClick={() => setTestimonialIndex((p) => (p - 1 + testimonials.length) % testimonials.length)}
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="btn-ghost h-10 w-10 px-0"
              onClick={() => setTestimonialIndex((p) => (p + 1) % testimonials.length)}
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Section>

      {/* LATEST INSIGHTS */}
      <TeamSection />

      <Section id="insights" title="Latest Insights" subtitle="Expert advice on release strategy and growth">
        <div className="grid gap-6 lg:grid-cols-3">
          {insights.map((a) => (
            <article key={a.title} className="glass overflow-hidden">
              <div className="relative h-44">
                <img src={a.img} alt={a.title} className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent, rgba(0,0,0,.55))" }} />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs"
                    style={{ background: "rgba(255,255,255,.12)", border: "1px solid var(--border)" }}
                  >
                    {a.tag}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="text-xs" style={{ color: "var(--muted)" }}>
                  {a.date} • {a.read}
                </div>
                <h3 className="mt-2 text-lg font-semibold">{a.title}</h3>
                <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                  {a.desc}
                </p>
                <button type="button" className="mt-4 inline-flex items-center gap-2 text-sm"
                  style={{ color: "var(--accent-1)" }}
                  onClick={() => setActiveInsight(a)}
                >
                  Read More <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Footer video section (kept) */}
      <VideoFooter />

      {/* Insight reader modal */}
      {activeInsight && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveInsight(null)} />
          <div className="relative glass w-full max-w-2xl p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>
                  {activeInsight.tag} • {activeInsight.date} • {activeInsight.read}
                </div>
                <h3 className="mt-2 text-2xl font-semibold">{activeInsight.title}</h3>
              </div>
              <button type="button" className="btn-ghost" onClick={() => setActiveInsight(null)}>
                Close
              </button>
            </div>

            <div className="mt-5 text-lg leading-relaxed" style={{ color: "var(--text)" }}>
              {/* simple readable body (can be replaced with real content later) */}
              <p>
                {activeInsight.desc}
              </p>
              <p className="mt-4" style={{ color: "var(--muted)" }}>
                Tip: Set a realistic release date, prepare your artwork + metadata early, and promote consistently for 2–3 weeks after release.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
