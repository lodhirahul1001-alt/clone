import { motion } from 'framer-motion';

export default function VideoFooter() {
  return (
    <div className="relative h-80 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="https://cdn.coverr.co/videos/coverr-dj-playing-in-a-nightclub-3634/1080p.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join the Digital Revolution
          </h2>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Transform your content with PR DIGITAL CMS. Start your journey today.
          </p>
        </motion.div>
      </div>
    </div>
  );
}