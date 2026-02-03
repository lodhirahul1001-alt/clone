import React from "react";

const people = [
  {
    name: "Lisa Thompson",
    role: "Customer Success Manager",
    photo: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39",
    bio: "Dedicated to ensuring customer satisfaction and long-term retention.",
    linkedin: "#",
    twitter: "#",
    email: "lisa@prdigital.com",
  },
  {
    name: "Laura Davis",
    role: "COO",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    bio: "Operations specialist with a background in scaling startups.",
    linkedin: "#",
    twitter: "#",
    email: "laura@prdigital.com",
  },
  {
    name: "Tom White",
    role: "Head of Product",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    bio: "Product leader focused on user-centric digital solutions.",
    linkedin: "#",
    twitter: "#",
    email: "tom@prdigital.com",
  },
  {
    name: "James Wilson",
    role: "CTO",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    bio: "Tech enthusiast passionate about scalable cloud systems.",
    linkedin: "#",
    twitter: "#",
    email: "james@prdigital.com",
  },
  {
    name: "Sarah Williams",
    role: "Director of Sales",
    photo: "https://images.unsplash.com/photo-1548142813-c348350df52b",
    bio: "Sales strategist driving sustainable revenue growth.",
    linkedin: "#",
    twitter: "#",
    email: "sarah@prdigital.com",
  },
  {
    name: "David Miller",
    role: "Lead Software Engineer",
    photo: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91",
    bio: "Senior developer with a love for clean architecture.",
    linkedin: "#",
    twitter: "#",
    email: "david@prdigital.com",
  },
  {
    name: "Emily Johnson",
    role: "Marketing",
    photo: "https://images.unsplash.com/photo-1546961329-78bef0414d7c",
    bio: "Marketing expert specializing in SaaS brand growth.",
    linkedin: "#",
    twitter: "#",
    email: "emily@prdigital.com",
  },
  {
    name: "Jillie Bernard",
    role: "Founder & CEO",
    photo: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    bio: "Visionary leader with 15+ years of industry experience.",
    linkedin: "#",
    twitter: "#",
    email: "jillie@prdigital.com",
  },
];

export default function TeamSection({ compact = false }) {
  return (
    <section className={compact ? "py-14" : "py-20"}>
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-[var(--text)]">
            Meet our Team
          </h2>
          <p className="mt-3 text-sm md:text-base text-[var(--muted)] max-w-2xl mx-auto">
            A diverse group of passionate professionals, each bringing unique
            skills and experiences to deliver innovation and excellence.
          </p>
        </div>

        {/* Hero Mosaic */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {people.map((p, idx) => (
            <div
              key={p.name}
              className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] ${
                idx === 1 || idx === 5 ? "row-span-2" : ""
              }`}
              style={{ minHeight: idx === 1 || idx === 5 ? 320 : 160 }}
            >
              <img
                src={p.photo}
                alt={p.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative p-6 h-full flex flex-col justify-end">
                <div className="text-white">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs opacity-80">{p.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Team List */}
        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-11">
          {people.map((p) => (
            <div
              key={p.name}
              className="group relative rounded-3xl p-6 bg-white/5 border border-white/10 backdrop-blur-xl
                         transition-all duration-300 hover:-translate-y-2
                         hover:shadow-[0_0_60px_rgba(168,85,247,0.35)]"
            >
              {/* Gradient glow */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition
                              bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-cyan-400/20 blur-xl -z-10" />

              {/* Avatar */}
              <div className="relative mx-auto w-20 h-20 rounded-full p-[2px]
                              bg-gradient-to-br from-purple-500 to-cyan-400">
                <img
                  src={p.photo}
                  alt={p.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="mt-5 text-center">
                <h3 className="text-lg font-medium text-white">
                  {p.name}
                </h3>
                <p className="text-sm text-purple-400 mt-1">
                  {p.role}
                </p>
                <p className="mt-3 text-xs text-white/60 leading-relaxed">
                  {p.bio}
                </p>
              </div>

              {/* Social icons (dummy) */}
              <div className="mt-5 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition">
                <span className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition" />
                <span className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition" />
                <span className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
