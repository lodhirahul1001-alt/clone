import { motion } from "framer-motion";
import { Award, Globe, Globe2, Users, ArrowRight } from "lucide-react";
import Section from "../components/Section";

const stats = [
  { number: "150+", label: "Digital Platforms", icon: Globe },
  { number: "50K+", label: "Audio Distributed", icon: Users },
  { number: "10+", label: "Years Experience", icon: Award },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const About = () => {
  return (
    <div className="overflow-x-hidden">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-25 mb-20">
        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
        >
          About <span className="text-neon">Silent Music Group</span>
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-base sm:text-lg md:text-xl text-[color:var(--muted)] max-w-3xl mx-auto"
        >
          Silent Music Group is the leading independent development partner for content creators,
          helping build audiences and careers through technology and services across distribution,
          publishing administration, and promotional services.
        </motion.p>
      </section>

      <Section
        id="trust"
        title="Join thousands of satisfied customers"
        subtitle="Trusted by artists, labels and studios across regions."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="glass p-6 text-center rounded-xl transition hover:-translate-y-1"
            >
              <div className="text-3xl md:text-4xl font-semibold">{s.number}</div>
              <div className="mt-2 text-sm text-[color:var(--muted)]">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 glass-soft p-6 md:p-8 rounded-2xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div
              className="h-12 w-12 rounded-2xl grid place-items-center shrink-0"
              style={{
                background: "linear-gradient(90deg, var(--accent-1), var(--accent-2))",
                color: "white",
              }}
            >
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-base md:text-lg">Global distribution made simple</div>
              <div className="text-sm text-[color:var(--muted)]">
                Deliver to major platforms and track everything in one place.
              </div>
            </div>
          </div>

          <a
            href="/signup"
            className="btn-primary flex items-center justify-center gap-2 w-full lg:w-auto"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </Section>

      

      {/* <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass p-8 text-center rounded-2xl hover:-translate-y-1 transition"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-4 text-neon" />
              <h3 className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</h3>
              <p className="text-[color:var(--muted)]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section> */}
{/* 
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24">
        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold mb-6"
        >
          Our <span className="text-neon">Mission</span>
        </motion.h2>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-base sm:text-lg md:text-xl text-[color:var(--muted)] max-w-3xl mx-auto"
        >
          Silent Music Group&apos;s mission is to best serve content creators and brands in the early
          stages of their development in the digital ecosystem, with fairness, expertise, respect
          and transparency.
        </motion.p>
      </section> */}
    </div>
  );
};

export default About;