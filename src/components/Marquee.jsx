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
  <section className="relative w-full py-10">
    {/* Full-width glass strip */}
    <div className="relative w-full overflow-hidden">
      {/* Strong background strip */}
      <div className="mx-0 w-full rounded-none marquee-strip">
        {/* Edge fade */}
        <div className="marquee-edge-fade" />

        <div className="marquee-track" aria-hidden="true">
          {[...logos, ...logos].map((logo, i) => (
            <div className="marquee-item" key={i}>
              <img
                src={logo.src}
                alt={logo.name}
                className="marquee-img marquee-img-white"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

}
