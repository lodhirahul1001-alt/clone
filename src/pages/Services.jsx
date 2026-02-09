import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Globe,
  Megaphone,
  Rocket,
  Shield,
  Users,
  Palette,
  Code2,
  ShoppingCart,
  RefreshCcw,
  Wrench,
  LayoutTemplate,
  Youtube,
  Image,
  Brush,
  Gauge,
} from 'lucide-react';
import OurServices from './OurServices';

const services = [
  {
    icon: Globe,
    title: 'Global Distribution',
    description: 'Distribute your content to over 150+ digital platforms worldwide with real-time tracking and analytics.',
    color: 'from-blue-400 to-blue-600'
  },
  {
    icon: Shield,
    title: 'Content Protection',
    description: 'Advanced security measures to protect your digital assets and intellectual property.',
    color: 'from-green-400 to-green-600'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Comprehensive analytics and reporting tools to track your content performance.',
    color: 'from-purple-400 to-purple-600'
  },
  {
    icon: Users,
    title: 'Audience Management',
    description: 'Tools to grow and engage with your audience across multiple platforms.',
    color: 'from-pink-400 to-pink-600'
  },
  {
    icon: Megaphone,
    title: 'Marketing Tools',
    description: 'Promotional tools and resources to amplify your reach and impact.',
    color: 'from-orange-400 to-orange-600'
  },
  {
    icon: Rocket,
    title: 'Growth Strategy',
    description: 'Personalized growth strategies and consulting services for your brand.',
    color: 'from-red-400 to-red-600'
  }
];

const websiteWorkServices = [
  {
    icon: Palette,
    title: 'Website Design',
    description: 'Modern, responsive UI/UX design for businesses, brands, and startups.',
    color: 'from-blue-400 to-indigo-600',
  },
  {
    icon: Code2,
    title: 'Website Development',
    description: 'Full website creation (static + dynamic) using latest technologies.',
    color: 'from-emerald-400 to-green-600',
  },
  {
    icon: ShoppingCart,
    title: 'E-Commerce Website Development',
    description: 'Online store with payment gateway, cart, and product management.',
    color: 'from-purple-400 to-fuchsia-600',
  },
  {
    icon: RefreshCcw,
    title: 'Website Redesign',
    description: 'Upgrade old websites into modern, fast, mobile-friendly designs.',
    color: 'from-pink-400 to-rose-600',
  },
  {
    icon: Wrench,
    title: 'Website Maintenance & Bug Fixing',
    description: 'Regular updates, security fixes, and performance improvements.',
    color: 'from-orange-400 to-amber-600',
  },
  {
    icon: LayoutTemplate,
    title: 'Landing Page Design',
    description: 'High-conversion pages for ads, products, or services.',
    color: 'from-cyan-400 to-blue-600',
  },
  {
    icon: Youtube,
    title: 'YouTube Automation (Faceless Channel)',
    description: 'Complete setup: script, voiceover, editing, upload.',
    color: 'from-red-400 to-red-600',
  },
  {
    icon: Image,
    title: 'YouTube Thumbnail & Banner Design',
    description: 'Eye-catching creatives to increase CTR and branding.',
    color: 'from-violet-400 to-purple-700',
  },
  {
    icon: Brush,
    title: 'Poster & Social Media Design',
    description: 'Posters, ads creatives, Instagram posts, promotional graphics.',
    color: 'from-teal-400 to-cyan-700',
  },
  // {
  //   icon: Gauge,
  //   title: 'SEO & Website Speed Optimization',
  //   description: 'Improve Google ranking + website loading speed.',
  //   color: 'from-lime-400 to-green-700',
  // },
];

export default function Services() {
  return (
    <div className="min-h-screen py-6">
      
      {/* Toggle Button */}


      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-6xl font-bold mb-6"
        >
          Track Your Release Status with{' '}
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Release Tracker
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-[color:var(--muted)] max-w-3xl mx-auto mb-8"
        >
          You pour your blood, sweat, and tears into creating content. Track its journey from submission to going live with our advanced tracking system.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-[color:var(--text)] px-8 py-4 rounded-full font-medium inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          HERE'S HOW IT WORKS
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-soft rounded-2xl p-8 border border-[color:var(--border)] hover:-translate-y-1 transition-all duration-200"
            >
              <div className={`bg-gradient-to-r ${service.color} w-12 h-12 rounded-lg flex items-center justify-center mb-6`}>
                <service.icon className="w-6 h-6 text-[color:var(--text)]" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-[color:var(--text)]">{service.title}</h3>
              <p className="text-[color:var(--muted)]">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <OurServices/>

      {/* Website Work Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-10 text-[color:var(--text)]"
        >
          Web-Site Work
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {websiteWorkServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="glass-soft rounded-2xl p-8 border border-[color:var(--border)] hover:-translate-y-1 transition-all duration-200"
            >
              <div className={`bg-gradient-to-r ${service.color} w-12 h-12 rounded-lg flex items-center justify-center mb-6`}>
                <service.icon className="w-6 h-6 text-[color:var(--text)]" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-[color:var(--text)]">{service.title}</h3>
              <p className="text-[color:var(--muted)]">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
