import React from 'react';
const logos = [
  { src: "https://gallery.vision/wp-content/themes/Gallery-Vision/assets/images/apple.webp", name: "Apple" },
  { src: "https://gallery.vision/wp-content/themes/Gallery-Vision/assets/images/Spotify.webp", name: "Spotify" },
  { src: "https://gallery.vision/wp-content/themes/Gallery-Vision/assets/images/amazon.webp", name: "Amazon" },
  { src: "https://gallery.vision/wp-content/themes/Gallery-Vision/assets/images/tidal-b.webp", name: "Tidal" },
  { src: "https://gallery.vision/wp-content/themes/Gallery-Vision/assets/images/Facebook.webp", name: "Facebook" },
  { src: "https://gallery.vision/wp-content/themes/Gallery-Vision/assets/images/tiktok.webp", name: "TikTok" },
  { src: "https://gallery.vision/wp-content/themes/Gallery-Vision/assets/images/vevo.webp", name: "Vevo" },
  // duplicate the list to make seamless loop
  { src: "https://gallery.vision/wp-content/themes/Gallery-Vision/assets/images/apple.webp", name: "Apple" },
  { src: "https://gallery.vision/wp-content/themes/Gallery-Vision/assets/images/Spotify.webp", name: "Spotify" },
  { src: "https://gallery.vision/wp-content/themes/Gallery-Vision/assets/images/amazon.webp", name: "Amazon" },
  { src: "https://gallery.vision/wp-content/themes/Gallery-Vision/assets/images/tidal-b.webp", name: "Tidal" },
];

export default function Marquee() {
  return (
    <div className="marquee-viewport">
      <div className="container-page py-6">
        <div className="glass-soft marquee-shell px-6 py-4">
          <div className="marquee-track" aria-hidden="true">
            {/* Duplicate list for seamless loop */}
            {[...logos, ...logos].map((logo, i) => (
              <div className="marquee-item" key={i}>
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="marquee-img"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
