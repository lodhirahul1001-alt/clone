import React, { useEffect, useState, useMemo } from "react";
import { fetchTracksApi } from "../../apis/TrackApis";
import { UploadTrack } from "../components/UploadTrack";
import { Edit2, Search } from "lucide-react";

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "live", label: "Live" },
  { value: "suspend", label: "Suspend" },
  { value: "reject", label: "Reject" },
  { value: "hold", label: "Hold" },
];

const sortOptions = [
  { value: "createdAt_desc", label: "Newest first" },
  { value: "createdAt_asc", label: "Oldest first" },
  { value: "title_asc", label: "Title A-Z" },
  { value: "title_desc", label: "Title Z-A" },
];

const ReleaseMusic = () => {
  const [tracks, setTracks] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0,
  });

  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt_desc");
  const [loading, setLoading] = useState(false);
  const [editTrack, setEditTrack] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const { sortBy, sortOrder } = useMemo(() => {
    const [field, order] = sort.split("_");
    return { sortBy: field, sortOrder: order };
  }, [sort]);

  const loadTracks = async () => {
    try {
      setLoading(true);
      const res = await fetchTracksApi({
        page: pagination.page,
        limit: pagination.limit,
        search,
        status: statusFilter,
        sortBy,
        sortOrder,
      });

      setTracks(res?.tracks || []);
      setPagination((p) => ({ ...p, ...res.pagination }));
    } catch (err) {
      // keep UI clean; handle errors silently for now
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTracks();
    // eslint-disable-next-line
  }, [pagination.page, statusFilter, sort]);

  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString() : "-";

  const getStoreLabel = (track) => {
    if (Array.isArray(track?.stores) && track.stores.length > 0) {
      return track.stores.join(", ");
    }
    if (typeof track?.store === "string" && track.store.trim()) {
      return track.store;
    }
    return "-";
  };

  const getCoverArt = (track) => {
    const candidates = [
      track?.coverArtUrl,
      track?.coverArt,
      track?.artwork,
      track?.albumArt,
      track?.image,
      track?.thumbnail,
    ];

    return candidates.find((value) => typeof value === "string" && value.trim());
  };

  return (
    <div className="dash-page space-y-4 w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl ml-2 font-semibold">Release Music</h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            View and manage all tracks you’ve uploaded.
          </p>
        </div>
        <button
          onClick={() => {
            setEditTrack(null);
            setShowUploadModal(true);
          }}
          className="btn-primary text-sm"
        >
          + Upload New Track
        </button>
      </div>

      {/* Filters */}
      <div className="dash-card p-4 flex flex-col lg:flex-row gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPagination((p) => ({ ...p, page: 1 }));
            loadTracks();
          }}
          className="flex gap-2 flex-1"
        >
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tracks"
              className="dash-input w-full pl-9 pr-3 py-2 text-sm"
            />
          </div>
          <button className="btn-primary text-sm">
            Search
          </button>
        </form>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="dash-input px-3 py-2 text-sm"
        >
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="dash-input px-3 py-2 text-sm"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="dash-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Album</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Label</th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-left">CAT</th>
                <th className="px-4 py-3 text-left">ISRC/UPC</th>
                <th className="px-4 py-3 text-left">Store</th>
                <th className="px-4 py-3 text-left">Stage</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={10} className="text-center py-6">
                    Loading...
                  </td>
                </tr>
              )}

              {!loading &&
                tracks.map((track) => (
                  <tr key={track._id} className="border-t">
                    <td className="px-4 py-3">{track.publicId || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {getCoverArt(track) ? (
                          <img
                            src={getCoverArt(track)}
                            alt={track.album || track.title || "Cover art"}
                            className="w-10 h-10 rounded-md object-cover border"
                            style={{ borderColor: "var(--dash-border)" }}
                            loading="lazy"
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-md border flex items-center justify-center text-xs"
                            style={{ borderColor: "var(--dash-border)", color: "var(--muted)" }}
                          >
                            N/A
                          </div>
                        )}
                        <span>{track.album || track.title || "-"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{track.title || "-"}</td>
                    <td className="px-4 py-3">{track.label || "-"}</td>
                    <td className="px-4 py-3">
                      {formatDate(track.createdAt)}
                    </td>
                    <td className="px-4 py-3">{track.cat || track.productionYear || "-"}</td>
                    <td className="px-4 py-3">{track.isrc || track.upcEan || "-"}</td>
                    <td className="px-4 py-3">{getStoreLabel(track)}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-lg dash-badge">
                        {track.stage || track.status || "pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          setEditTrack(track);
                          setShowUploadModal(true);
                        }}
                        className="p-2 border rounded-lg"
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal (full-screen modal handled inside UploadTrack) */}
      {showUploadModal && (
        <UploadTrack
          view="modal"
          mode={editTrack ? "edit" : "create"}
          initialTrack={editTrack}
          onClose={() => {
            setShowUploadModal(false);
            setEditTrack(null);
          }}
          onSuccess={() => {
            setShowUploadModal(false);
            loadTracks();
          }}
        />
      )}
    </div>
  );
};

export default ReleaseMusic;
