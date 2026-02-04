import React from 'react';
import { motion } from 'framer-motion';

const logos = [
  {
    name: 'Spotify',
    url: 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=120&h=120&fit=crop',
    color: '#1DB954',
  },
  {
    name: 'Apple Music',
    url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=120&h=120&fit=crop',
    color: '#FA243C',
  },
  {
    name: 'YouTube Music',
    url: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=120&h=120&fit=crop',
    color: '#FF0000',
  },
  {
    name: 'Amazon Music',
    url: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=120&h=120&fit=crop',
    color: '#FF9900',
  },
  {
    name: 'Deezer',
    url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=120&h=120&fit=crop',
    color: '#FEAA2D',
  },
  {
    name: 'Tidal',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=120&h=120&fit=crop',
    color: '#000000',
  },
  {
    name: 'SoundCloud',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&h=120&fit=crop',
    color: '#FF5500',
  },
  {
    name: 'Pandora',
    url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=120&h=120&fit=crop',
    color: '#005483',
  },
];

export function AnimatedLogoCarousel() {
  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Distribute to All Major Platforms
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Your music will be available on these streaming services and more
        </p>
      </div>

      <div className="relative">
        {/* Row 1 - Moving Right */}
        <motion.div
          className="flex gap-8 mb-8"
          animate={{ x: [0, -1000] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {[...logos, ...logos].map((logo, index) => (
            <motion.div
              key={`row1-${index}`}
              className="flex-shrink-0 group"
              whileHover={{
                scale: 1.1,
                rotate: 5,
                transition: { duration: 0.2 },
              }}
            >
              <div
                className="w-24 h-24 rounded-2xl shadow-lg flex items-center justify-center transition-all duration-300 group-hover:shadow-xl"
                style={{ backgroundColor: logo.color }}
              >
                <img
                  src={logo.url}
                  alt={logo.name}
                  className="w-16 h-16 rounded-xl object-cover filter brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
              <p className="text-center text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                {logo.name}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Row 2 - Moving Left */}
        <motion.div
          className="flex gap-8"
          animate={{ x: [-1000, 0] }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {[...logos.slice().reverse(), ...logos.slice().reverse()].map((logo, index) => (
            <motion.div
              key={`row2-${index}`}
              className="flex-shrink-0 group"
              whileHover={{
                scale: 1.1,
                rotate: -5,
                transition: { duration: 0.2 },
              }}
            >
              <div
                className="w-24 h-24 rounded-2xl shadow-lg flex items-center justify-center transition-all duration-300 group-hover:shadow-xl"
                style={{ backgroundColor: logo.color }}
              >
                <img
                  src={logo.url}
                  alt={logo.name}
                  className="w-16 h-16 rounded-xl object-cover filter brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
              <p className="text-center text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                {logo.name}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Gradient Overlays */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-blue-50 to-transparent dark:from-gray-800 dark:to-transparent pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-blue-50 to-transparent dark:from-gray-800 dark:to-transparent pointer-events-none"></div>
      </div>

      {/* Stats Section */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto px-4">
        {[
          { value: '180+', label: 'Streaming Platforms', color: 'text-blue-600 dark:text-blue-400' },
          { value: '24h', label: 'Average Delivery', color: 'text-green-600 dark:text-green-400' },
          { value: '100%', label: 'Royalty Retention', color: 'text-purple-600 dark:text-purple-400' },
          { value: '∞', label: 'Unlimited Releases', color: 'text-red-600 dark:text-red-400' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
          >
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
