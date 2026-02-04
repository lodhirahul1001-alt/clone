import React, { useState } from "react";
import { Youtube, Music, Instagram } from "lucide-react";

export default function MyArtists() {
  const [artists] = useState([]);


  // const fetchArtists = async () => {
  //   try {
  //     const res = await axios.get("");
  //     setArtists(res.data);
  //   } catch (err) {
  //     console.error("Error fetching artists:", err);
  //   }
  // };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl ml-8 font-semibold">My Artists</h2>
        <div className="relative">
          <input
            type="search"
            placeholder="Search artists..."
            className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute right-3 top-2.5">🔍</span>
        </div>
      </div>

      <div className="grid gap-6">
        {artists.map((artist) => (
          <div
            key={artist._id}
            className="bg-transparent p-6 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              {artist.image ? (
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500">
                  {artist.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              )}
              <h3 className="text-xl font-medium">{artist.name}</h3>
            </div>

            <div className="flex gap-4">
              {artist.platforms.spotify && <Music className="w-6 h-6 text-green-500" />}
              {artist.platforms.youtube && <Youtube className="w-6 h-6 text-red-500" />}
              {artist.platforms.instagram && <Instagram className="w-6 h-6 text-purple-500" />}
              {artist.platforms.itunes && <Music className="w-6 h-6 text-gray-700" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
