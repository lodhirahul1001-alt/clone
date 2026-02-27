import React from "react";

const partnerLogos =  [
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
  const logos = [...partnerLogos, ...partnerLogos];

  return (
    <section
      className="
        w-screen relative left-1/2 -translate-x-1/2
        overflow-hidden py-6
        bg-white/5 dark:bg-black/20
        border-y border-black/10 dark:border-white/10
      "
    >
      {/* edge fade left */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white/5 to-transparent dark:from-black/90" />
      {/* edge fade right */}
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white/5 to-transparent dark:from-black/90" />

      <div className="flex w-max items-center gap-14 px-20 animate-[marquee_28s_linear_infinite]">
        {logos.map((logo, i) => (
          <div key={i} className="flex-shrink-0">
            <img
              src={logo.src}
              alt={logo.name}
              title={logo.name}
              className="h-8 w-auto object-contain opacity-90 grayscale brightness-50 dark:brightness-200"
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
