import React, { useEffect, useState, useMemo } from "react";
import { fetchTracksApi } from "../../apis/TrackApis";
import { UploadTrack } from "../components/UploadTrack";
import { Edit2, Eye, Search } from "lucide-react";


const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "approve", label: "Approve" },
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
  const [previewImage, setPreviewImage] = useState(null);

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

  const getSongRedirectUrl = (track) => {
    const candidates = [
      track?.songLink,
      track?.songUrl,
      track?.albumLink,
      track?.redirectLink,
      track?.audioUrl,
      track?.audioFileUrl,
      track?.streamUrl,
    ];

    return candidates.find((value) => typeof value === "string" && value.trim());
  };

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

  const getTrackStatusValue = (track) => {
    const rawStatus = String(track?.status || track?.stage || "")
      .trim()
      .toLowerCase();

    if (["approve", "approved", "active", "live"].includes(rawStatus)) {
      return "approve";
    }
    if (["reject", "rejected"].includes(rawStatus)) {
      return "reject";
    }
    if (["hold", "on hold"].includes(rawStatus)) {
      return "hold";
    }
    if (["suspend", "suspended"].includes(rawStatus)) {
      return "suspend";
    }
    return "pending";
  };

  const getTrackStatusLabel = (track) => {
    const status = getTrackStatusValue(track);
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const canEditTrack = (track) => getTrackStatusValue(track) === "pending";

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
                <th className="px-4 py-3 text-left">Serial No.</th>
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
                style={{
                  borderColor: "var(--dash-border)",
                  color: "var(--muted)",
                }}
              >
                N/A
              </div>
            )}

            {getSongRedirectUrl(track) ? (
              <a
                href={getSongRedirectUrl(track)}
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                {track.album || track.title || "-"}
              </a>
            ) : (
              <span>{track.album || track.title || "-"}</span>
            )}
          </div>
        </td>

        <td className="px-4 py-3">{track.title || "-"}</td>
        <td className="px-4 py-3">{track.label || "-"}</td>
        <td className="px-4 py-3">{formatDate(track.createdAt)}</td>
        <td className="px-4 py-3">
          {track.cat || track.productionYear || "-"}
        </td>
        <td className="px-4 py-3">
          {track.isrcUpcCode || track.isrc || track.upcEan || "-"}
        </td>

        <td className="px-4 py-3">
          <div className="flex flex-col gap-1">
            {getStoreLabel(track) !== "-" ? (
              <span>{getStoreLabel(track)}</span>
            ) : null}
            <button
              type="button"
              onClick={() =>
                setPreviewImage("/allstore45.png.jpeg")
              }
              className="text-blue-600 hover:underline text-left"
            >
              View 45+ stores
            </button>
          </div>
        </td>

        <td className="px-4 py-3">
          <span className="px-2 capitalize py-1 rounded-lg dash-badge">
            {getTrackStatusLabel(track)}
          </span>
        </td>

        <td className="px-4 py-3 text-right">
          <button
            onClick={() => {
              setEditTrack(track);
              setShowUploadModal(true);
            }}
            className="p-2 border rounded-lg"
            title={canEditTrack(track) ? "Edit track details" : "View track details"}
            aria-label={canEditTrack(track) ? "Edit track details" : "View track details"}
          >
            {canEditTrack(track) ? <Edit2 size={16} /> : <Eye size={16} />}
          </button>
        </td>
      </tr>
    ))}
</tbody>
          </table>
        </div>
      </div>

      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={() => setPreviewImage(null)}
            aria-label="Close store preview"
          />

          <div className="relative w-full max-w-6xl dash-card overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b" style={{ borderColor: "var(--dash-border)" }}>
              <h2 className="text-base font-semibold">Store Preview</h2>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="text-red-500 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-4 md:p-6">
              <div
                className="w-full rounded-2xl border bg-white p-3 md:p-5 overflow-auto"
                style={{ borderColor: "var(--dash-border)" }}
              >
                <img
                  src={previewImage}
                  alt="45+ store logos"
                  className="mx-auto block w-full h-auto rounded-xl"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal (full-screen modal handled inside UploadTrack) */}
      {showUploadModal && (
        <UploadTrack
          view="modal"
          mode={editTrack ? (canEditTrack(editTrack) ? "edit" : "view") : "create"}
          readOnly={Boolean(editTrack) && !canEditTrack(editTrack)}
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
