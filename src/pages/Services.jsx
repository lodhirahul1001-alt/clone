import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Globe, Megaphone, Rocket, Shield, Users } from 'lucide-react';
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

export default function Services() {
  const [darkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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
          Track Your Release Status with{' '}
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Release Tracker
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8"
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
              className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-8 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              <div className={`bg-gradient-to-r ${service.color} w-12 h-12 rounded-lg flex items-center justify-center mb-6`}>
                <service.icon className="w-6 h-6 text-[color:var(--text)]" />
              </div>
              <h3 className="text-xl font-bold mb-4">{service.title}</h3>
              <p className="text-gray-700 dark:text-gray-400">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <OurServices/>
    </div>
  );
}
