import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  adminGetTracksApi,
  adminUpdateTrackMetaApi,
  adminUpdateTrackStatusApi,
} from "../../apis/AdminApis";

const statusOptions = ["pending", "active", "rejected"];

const badgeClass = (status) => {
  const s = String(status || "pending").toLowerCase();
  if (s === "active") return "bg-green-500/15 border border-green-500/30 text-green-200";
  if (s === "rejected") return "bg-red-500/15 border border-red-500/30 text-red-200";
  return "bg-yellow-500/15 border border-yellow-500/30 text-yellow-200";
};

export default function AdminTracks() {
  const [loading, setLoading] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [savingRow, setSavingRow] = useState("");

  const fetchTracks = async () => {
    try {
      setLoading(true);
      const data = await adminGetTracksApi({ search: query, status: statusFilter, limit: 50 });
      setTracks(data?.tracks || []);
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed to load tracks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tracks;
    return tracks.filter((t) =>
      [t.title, t.primaryArtist, t.publicId, t.label, t?.user?.email]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query, tracks]);

  const updateStatus = async (trackId, status) => {
    try {
      await adminUpdateTrackStatusApi(trackId, { status });
      toast.success("Status updated");
      setTracks((prev) => prev.map((t) => (t._id === trackId ? { ...t, status } : t)));
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed to update status");
    }
  };

  const updateMeta = async (trackId) => {
    const track = tracks.find((t) => t._id === trackId);
    if (!track) return;

    try {
      setSavingRow(trackId);
      await adminUpdateTrackMetaApi(trackId, {
        isrcUpcCode: track.isrcUpcCode || track.isrc || track.upcEan || "",
        songLink: track.songLink || "",
      });
      toast.success("ISRC/UPC and song link updated");
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed to update track details");
    } finally {
      setSavingRow("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Admin · Tracks</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Review uploads, update ISRC/UPC and set status (pending / active / rejected).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title/artist/publicId/email..."
            className="dash-input"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="dash-input"
          >
            <option className='drop-down'  value="all">All status</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button className="dash-btn" type="button" onClick={fetchTracks} disabled={loading}>
            Refresh
          </button>
        </div>
      </div>

      <div className="dash-card p-3 rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ color: "var(--muted)" }}>
              <th className="text-left p-2">Cover</th>
              <th className="text-left p-2">Track</th>
              <th className="text-left p-2">Artist</th>
              <th className="text-left p-2">Uploader</th>
              <th className="text-left p-2">Public ID</th>
              <th className="text-left p-2">Audio</th>
              <th className="text-left p-2">ISRC/UPC Code</th>
              <th className="text-left p-2">Album/Song Link</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-2" colSpan={10}>
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td className="p-2" colSpan={10}>
                  No tracks found
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
                <tr key={t._id} style={{ borderTop: "1px solid var(--dash-border)" }}>
                  <td className="p-2">
                    {t.coverArtUrl ? (
                      <img
                        src={t.coverArtUrl}
                        alt="cover"
                        className="h-10 w-10 rounded-xl object-cover border"
                        style={{ borderColor: "var(--dash-border)" }}
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-2 whitespace-nowrap">{t.title || "-"}</td>
                  <td className="p-2 whitespace-nowrap">{t.primaryArtist || "-"}</td>
                  <td className="p-2 whitespace-nowrap">{t?.user?.email || "-"}</td>
                  <td className="p-2 whitespace-nowrap">{t.publicId || "-"}</td>
                  <td className="p-2">
                    {t.audioUrl ? (
                      <a className="underline" href={t.audioUrl} target="_blank" rel="noreferrer">
                        Open
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-2 min-w-[220px]">
                    <input
                      value={t.isrcUpcCode || t.isrc || t.upcEan || ""}
                      onChange={(e) =>
                        setTracks((prev) =>
                          prev.map((track) =>
                            track._id === t._id
                              ? {
                                  ...track,
                                  isrcUpcCode: e.target.value,
                                  isrc: e.target.value,
                                  upcEan: e.target.value,
                                }
                              : track
                          )
                        )
                      }
                      placeholder="Admin update ISRC/UPC"
                      className="dash-input w-full"
                    />
                  </td>
                  <td className="p-2 min-w-[260px]">
                    <input
                      value={t.songLink || ""}
                      onChange={(e) =>
                        setTracks((prev) =>
                          prev.map((track) =>
                            track._id === t._id ? { ...track, songLink: e.target.value } : track
                          )
                        )
                      }
                      placeholder="https://song-link"
                      className="dash-input w-full"
                    />
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-lg inline-block ${badgeClass(t.status)}`}>{t.status || "pending"}</span>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <select
                        value={t.status || "pending"}
                        onChange={(e) => updateStatus(t._id, e.target.value)}
                        className="dash-input"
                      >
                        {statusOptions.map((s) => (
                          <option className='drop-down'  key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => updateMeta(t._id)}
                        className="dash-btn"
                        disabled={savingRow === t._id}
                      >
                        {savingRow === t._id ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
