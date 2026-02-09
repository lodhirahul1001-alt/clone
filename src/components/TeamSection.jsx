import { Instagram } from "lucide-react";
import React from "react";

const people = [
  // {
  //   name: "Lisa Thompson",
  //   role: "Customer Success Manager",
  //   photo: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39",
  //   bio: "Dedicated to ensuring customer satisfaction and long-term retention.",
  //   linkedin: "#",
  //   twitter: "#",
  //   email: "lisa@prdigital.com",
  // },
  // {
  //   name: "Laura Davis",
  //   role: "COO",
  //   photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
  //   bio: "Operations specialist with a background in scaling startups.",
  //   linkedin: "#",
  //   twitter: "#",
  //   email: "laura@prdigital.com",
  // },
  // {
  //   name: "Tom White",
  //   role: "Head of Product",
  //   photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
  //   bio: "Product leader focused on user-centric digital solutions.",
  //   linkedin: "#",
  //   twitter: "#",
  //   email: "tom@prdigital.com",
  // },
  // {
  //   name: "James Wilson",
  //   role: "CTO",
  //   photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  //   bio: "Tech enthusiast passionate about scalable cloud systems.",
  //   linkedin: "#",
  //   twitter: "#",
  //   email: "james@prdigital.com",
  // },
  {
    name: "Rahul Lodhi",
    role: "Website Devloper",
    photo: "https://i.pinimg.com/736x/e2/54/52/e254524205172a4716c61e6bbe6fc060.jpg",
    bio: "Website Developer & Designer crafting modern, user-focused digital experiences.",
    linkedin: "",
    Instagram: "@lodhi2449",
    email: "Lodhirahul7002@.com",
  },
  {
    name: "R.K Yadav",
    role: "Director Of Sales",
    photo: "https://i.pinimg.com/736x/9a/02/fc/9a02fce3161c5eef1bea77ea13be4a84.jpg",
    bio: "Director of Sales with a strong focus on web solutions, growth strategy, and high-performing revenue teams.",
    linkedin: "#",
    twitter: "#",
    email: "david@prdigital.com",
  },
  {
    name: "Sagar Gupta",
    role: "Manager",
    photo: "https://i.pinimg.com/736x/4f/27/80/4f2780676e3703302c2adb8a0a91aba2.jpg",
    bio: "Digital marketing specialist driving traffic, leads, and conversions through data-backed campaigns.",
    linkedin: "#",
    twitter: "#",
    email: "emily@prdigital.com",
  },
  {
    name: "A.K Yadav",
    role: "Founder & CEO",
    photo: "https://i.pinimg.com/736x/bb/ba/f2/bbbaf2989cb34bd317724a07ca350a0c.jpg",
    bio: "Visionary leader with 10+ years of industry experience Web-focused company delivering modern, high-impact solutions..",
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
          <h2 className="text-3xl text-neon md:text-5xl font-semibold tracking-tight ]">
            Meet Our Team
          </h2>
          <p className="mt-3 text-sm md:text-base text-[var(--muted)] max-w-2xl mx-auto">
            A diverse group of passionate professionals, each bringing unique
            skills and experiences to deliver innovation and excellence.
          </p>
        </div>

        {/* Hero Mosaic */}
        {/* <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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
                <div className="text-[color:var(--text)]">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs opacity-80">{p.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div> */}

        {/* Team List */}
        {/* Cards */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-14">
  {people.map((p) => (
    <div
      key={p.name}
      className="group relative rounded-[28px] p-6 glass-soft shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.02]"
    >
      {/* Animated glow */}
      <div
        className="absolute inset-0 -z-10 rounded-[28px]
                   opacity-0 group-hover:opacity-100 transition duration-500
                   bg-gradient-to-br from-purple-500/80 via-pink-500/20 to-cyan-400/30
                   blur-3xl"
      />

      {/* Avatar */}
      <div
        className="relative mx-auto w-20 h-20 rounded-full p-[2px]
                   bg-gradient-to-br from-purple-700 to-cyan-400
                   shadow-[0_0_0_0_rgba(168,85,247,0.6)]
                   group-hover:shadow-[0_0_30px_5px_rgba(168,85,247,0.6)]
                   transition duration-500"
      >
        <img
          src={p.photo}
          alt={p.name}
          className="w-full h-full rounded-full object-cover bg-[color:var(--panel)]"
        />
      </div>

      {/* Content */}
      <div className="mt-6 text-center transition duration-500 group-hover:translate-y-[-2px]">
        <h3 className="text-lg font-semibold tracking-tight text-[color:var(--text)]">
          {p.name}
        </h3>

        <p className="text-sm font-medium mt-1 text-neon">
          {p.role}
        </p>

        <p className="mt-3 text-sm text-[color:var(--muted)] leading-relaxed">
          {p.bio}
        </p>
      </div>

      {/* Social icons */}
      <div className="mt-7 flex justify-center gap-3">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className="h-9 w-9 rounded-xl bg-[color:var(--panel-soft)] border border-[color:var(--border)] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 hover:scale-110 hover:shadow-lg"
          />
        ))}
      </div>

      {/* Subtle shine */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[28px]
                   bg-gradient-to-tr from-white/30 via-transparent to-transparent
                   opacity-0 group-hover:opacity-100 transition duration-700"
      />
    </div>
  ))}
</div>

      </div>
    </section>
  );
}
