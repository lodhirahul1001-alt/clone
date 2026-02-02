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
        >
          PR DIGITAL CMS is the leading independent development partner for
          content creators, helping build audiences and careers through
          technology and services across distribution, publishing
          administration, and promotional services.
        </motion.p>
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
    </div>
  );
};

export default About;
