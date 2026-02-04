<<<<<<< HEAD
import { motion } from 'framer-motion';
import { Award, Globe, Users } from 'lucide-react';


const stats = [
  { number: '150+', label: 'Digital Platforms', icon: Globe },
  { number: '1M+', label: 'Content Creators', icon: Users },
  { number: '10+', label: 'Years Experience', icon: Award }
];
const About = () => {
  return (
    <div className="min-h-screen">
      {/* Toggle Button */}

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-6xl font-bold mb-6"
        >
          About{" "}
          <span className="text-neon">PR DIGITAL CMS</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-[color:var(--muted)] max-w-3xl mx-auto"
=======
import { motion } from "framer-motion";
import {
  Award,
  Globe,
  Globe2,
  Users,
  ArrowRight,
} from "lucide-react";
import Section from "../components/Section";

const stats = [
  { number: "150+", label: "Digital Platforms", icon: Globe },
  { number: "1M+", label: "Content Creators", icon: Users },
  { number: "10+", label: "Years Experience", icon: Award },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const About = () => {
  return (
    // <div className="min-h-screen overflow-x-hidden">
     <div className="overflow-x-hidden">

      {/* Trust Section */}
      <Section
        id="trust"
        title="Join thousands of satisfied customers"
        subtitle="Trusted by artists, labels and studios across regions."
      >
        {/* Stats mini cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="glass p-6 text-center rounded-xl transition hover:-translate-y-1"
            >
              <div className="text-3xl md:text-4xl font-semibold">
                {s.number}
              </div>
              <div className="mt-2 text-sm text-[color:var(--muted)]">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 glass-soft p-6 md:p-8 rounded-2xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div
              className="h-12 w-12 rounded-2xl grid place-items-center shrink-0"
              style={{
                background:
                  "linear-gradient(90deg, var(--accent-1), var(--accent-2))",
                color: "white",
              }}
            >
              <Globe2 className="w-5 h-5" />
            </div>

            <div>
              <div className="font-semibold text-base md:text-lg">
                Global distribution made simple
              </div>
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

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
        >
          About <span className="text-neon">PR DIGITAL CMS</span>
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-base sm:text-lg md:text-xl text-[color:var(--muted)] max-w-3xl mx-auto"
>>>>>>> 649e8b6 (fix all)
        >
          PR DIGITAL CMS is the leading independent development partner for
          content creators, helping build audiences and careers through
          technology and services across distribution, publishing
          administration, and promotional services.
        </motion.p>
<<<<<<< HEAD
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass p-8 text-center transition-transform hover:translate-y-[-2px]"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-4 text-neon" />
              <h3 className="text-4xl font-bold mb-2">{stat.number}</h3>
              <p className="text-[color:var(--muted)]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-6"
        >
          Our{" "}
          <span className="text-neon">Mission</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-[color:var(--muted)] max-w-3xl mx-auto"
        >
          PR DIGITAL CMS's mission is to best serve content creators and brands
          in the early stages of their development in the digital ecosystem,
          with fairness, expertise, respect and transparency.
        </motion.p>
      </div>
=======
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
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
              <h3 className="text-3xl md:text-4xl font-bold mb-2">
                {stat.number}
              </h3>
              <p className="text-[color:var(--muted)]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
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
          PR DIGITAL CMS&apos;s mission is to best serve content creators and
          brands in the early stages of their development in the digital
          ecosystem, with fairness, expertise, respect and transparency.
        </motion.p>
      </section>
>>>>>>> 649e8b6 (fix all)
    </div>
  );
};

export default About;
