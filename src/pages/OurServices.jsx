import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

const features = [
  {
    icon: 'Music',
    color: 'from-blue-500 to-purple-600',
    title: 'Music Distribution',
    description:
      'Distribute your music to over 150 streaming platforms worldwide with our comprehensive distribution network.',
  },
  {
    icon: 'Phone',
    color: 'from-pink-500 to-red-500',
    title: 'Callertune Distribution',
    description:
      'Make your music ring on millions of phones with our global callertune distribution network.',
  },
  {
    icon: 'Video',
    color: 'from-red-500 to-yellow-500',
    title: 'VEVO Video Distribution',
    description: 'Get your music videos on VEVO and reach millions of viewers worldwide.',
  },
  {
    icon: 'FileText',
    color: 'from-green-500 to-emerald-600',
    title: 'Lyrics Distribution',
    description: 'Distribute your song lyrics across major platforms and reach more fans.',
  },
  {
    icon: 'YoutubeIcon',
    color: 'from-yellow-400 to-red-600',
    title: 'YouTube MCN',
    description: 'Join our YouTube Multi-Channel Network for better monetization and support.',
  },
  {
    icon: 'Monitor',
    color: 'from-indigo-500 to-blue-600',
    title: 'Channel Management',
    description: 'Professional management of your YouTube and social media channels.',
  },
  {
    icon: 'User',
    color: 'from-orange-400 to-pink-500',
    title: 'Artist Management',
    description: 'Comprehensive artist management services to grow your career.',
  },
  {
    icon: 'BarChart3',
    color: 'from-blue-400 to-teal-500',
    title: 'Dashboard Development',
    description: 'Custom music distribution dashboards for labels and artists.',
  },
  {
    icon: 'Monitor',
    color: 'from-purple-500 to-indigo-600',
    title: 'Website Development',
    description: 'Professional website development for artists and music businesses.',
  },
  {
    icon: 'Youtube',
    color: 'from-red-400 to-pink-600',
    title: 'Join Channel in MCN',
    description: 'Join our MCN network and get access to premium features and support.',
  },
  {
    icon: 'Disc',
    color: 'from-green-400 to-cyan-500',
    title: 'White Label Solution',
    description:
      'Custom branded music distribution platform with your own branding and features.',
  },
  {
    icon: 'Crown',
    color: 'from-yellow-400 to-orange-500',
    title: 'Master Dashboard Creation',
    description:
      'Comprehensive master dashboard for managing multiple artists, labels, and distribution channels.',
  },
];

export default function OurServices() {
  return (
    <div className="our-services-container">
      {/* Load Poppins font only in this component */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
          .our-services-container {
            font-family: 'Poppins', sans-serif;
          }
        `}
      </style>

      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Our Services
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => {
              const IconComponent = LucideIcons[feature.icon];
              return (
                <div
                  key={index}
                  className="glass-soft rounded-2xl p-6 shadow-sm hover:shadow-md transition-transform hover:scale-[1.02]"
                >
                  <div
                    className={`bg-gradient-to-r ${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-6`}
                  >
                    {IconComponent && <IconComponent className="w-6 h-6 text-[color:var(--text)]" />}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
