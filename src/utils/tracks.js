const RELEASED_TRACK_STATUSES = new Set(["approve", "approved", "active", "live"]);
const REJECTED_TRACK_STATUSES = new Set(["reject", "rejected"]);
const HOLD_TRACK_STATUSES = new Set(["hold", "on hold"]);
const SUSPENDED_TRACK_STATUSES = new Set(["suspend", "suspended"]);

export function getTrackStatusValue(track = {}) {
  const rawStatus = String(track?.status || track?.stage || "")
    .trim()
    .toLowerCase();

  if (RELEASED_TRACK_STATUSES.has(rawStatus)) return "approve";
  if (REJECTED_TRACK_STATUSES.has(rawStatus)) return "reject";
  if (HOLD_TRACK_STATUSES.has(rawStatus)) return "hold";
  if (SUSPENDED_TRACK_STATUSES.has(rawStatus)) return "suspend";
  return "pending";
}

export function isReleasedTrack(track = {}) {
  return getTrackStatusValue(track) === "approve";
}

export function getTrackStatusLabel(track = {}) {
  const status = getTrackStatusValue(track);
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function getTracksFromResponse(response = {}) {
  if (Array.isArray(response?.tracks)) return response.tracks;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

export function getTrackTotalPages(response = {}) {
  const pagination = response?.pagination || {};
  const value = Number(
    pagination?.totalPages ??
    response?.totalPages ??
    1
  );

  return Number.isFinite(value) && value > 0 ? value : 1;
}

export function getTrackTotalItems(response = {}) {
  const pagination = response?.pagination || {};
  const value = Number(
    pagination?.totalItems ??
    pagination?.total ??
    pagination?.count ??
    response?.totalItems ??
    response?.count
  );

  return Number.isFinite(value) && value >= 0 ? value : null;
}
