import React from "react";

const partnerLogos = [
  { src: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg", name: "Spotify" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_Music_logo.svg", name: "Apple Music" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Amazon_Music_logo.svg", name: "Amazon Music" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/2/26/TIDAL_logo.svg", name: "TIDAL" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/0/08/YouTube_Music_logo.svg", name: "YouTube Music" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/5/53/Deezer_logo.svg", name: "Deezer" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Pandora_Logo.svg", name: "Pandora" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/5/51/Anghami_logo.svg", name: "Anghami" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/7/75/TikTok_logo.svg", name: "TikTok" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/8/83/Facebook_logo_%282019%29.svg", name: "Facebook" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/8/89/Instagram_logo_2016.svg", name: "Instagram" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/4/4f/SoundCloud_logo.svg", name: "SoundCloud" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/2/21/Resso_logo.svg", name: "Resso" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/2/24/KKBOX_Logo.svg", name: "KKBOX" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/6/6e/JioSaavn_logo.svg", name: "JioSaavn" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/6/6e/NetEase_Cloud_Music_logo.svg", name: "NetEase Cloud Music" }
];

export default function Marquee() {
  const logos = [...partnerLogos, ...partnerLogos]; // duplicate for loop

  return (
    <section
      className="
        w-screen relative left-1/2 -translate-x-1/2
        overflow-hidden py-6
        bg-white/5 dark:bg-black/20
        border-y border-white/10 dark:border-white/10
      "
    >
      {/* fade left */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-black/80 to-transparent dark:from-black/90" />
      {/* fade right */}
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-black/80 to-transparent dark:from-black/90" />

      <div
        className="
          flex w-max items-center gap-14 px-20
          animate-[marquee_28s_linear_infinite]
        "
      >
        {logos.map((logo, i) => (
          <div key={i} className="flex-shrink-0">
            <img
              src={logo.src}
              alt={logo.name}
              className="
                h-8 w-auto object-contain
                opacity-90
                filter grayscale
                dark:brightness-200
                brightness-50
              "
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
