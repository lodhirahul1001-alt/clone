import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { fetchTracksApi } from "../../apis/TrackApis";
import { AxiosIntance } from "../../config/Axios.Intance";

const normalizeClaim = (claim) => ({
  _id: claim?._id || Math.random().toString(36).slice(2),
  claimCategory: claim?.claimCategory || claim?.claim_category || "",
  claimUrl: claim?.claimUrl || claim?.claim_url || "",
  releaseTitle: claim?.releaseTitle || claim?.release_title || "",
  releasePublicId: claim?.releasePublicId || claim?.release_public_id || "",
  isrc: claim?.isrc || "",
  cmsName: claim?.cmsName || claim?.cms_name || "",
  status: claim?.status || "pending",
  createdAt: claim?.createdAt || claim?.created_at || "",
});

export default function ReleaseVideo() {
  const { user } = useSelector((state) => state.auth);

  const [isLoadingReleases, setIsLoadingReleases] = useState(false);
  const [releaseOptions, setReleaseOptions] = useState([]);
  const [claims, setClaims] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const GOOGLE_SHEET_WEBHOOK = import.meta.env.VITE_CREATE_CLAIM_GOOGLE_SHEET;

  const [formData, setFormData] = useState({
    claimCategory: "",
    claimUrl: "",
    releaseId: "",
    isrc: "",
    cmsName: "WMG",
  });

  const selectedRelease = useMemo(
    () => releaseOptions.find((r) => r._id === formData.releaseId),
    [releaseOptions, formData.releaseId]
  );

  const loadMyClaims = async () => {
    try {
      const res = await AxiosIntance.get("/claims/my");
      const items = res?.data?.items || res?.data?.claims || [];
      setClaims(items.map(normalizeClaim));
    } catch (error) {
      console.error("Failed to load claims:", error?.response?.data || error.message);
    }
  };

  useEffect(() => {
    const loadUserReleases = async () => {
      try {
        setIsLoadingReleases(true);
        const res = await fetchTracksApi({
          page: 1,
          limit: 200,
          search: "",
          status: "all",
          sortBy: "createdAt",
          sortOrder: "desc",
        });
        setReleaseOptions(res?.tracks || []);
      } catch (error) {
        console.error("Failed to load releases:", error);
      } finally {
        setIsLoadingReleases(false);
      }
    };

    loadUserReleases();
    loadMyClaims();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "releaseId") {
      const release = releaseOptions.find((r) => r._id === value);
      setFormData((prev) => ({
        ...prev,
        releaseId: value,
        isrc: release?.isrc || release?.upcEan || "",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({
      claimCategory: "",
      claimUrl: "",
      releaseId: "",
      isrc: "",
      cmsName: "WMG",
    });
    setFeedback({ type: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", message: "" });
    setIsSending(true);

    try {
      const mongoPayload = {
        claimCategory: formData.claimCategory,
        claimUrl: formData.claimUrl,
        releaseId: formData.releaseId || null,
        releaseTitle: selectedRelease?.title || selectedRelease?.album || "",
        releasePublicId: selectedRelease?.publicId || "",
        isrc: formData.isrc,
        cmsName: formData.cmsName,
        note: "",
      };

      const mongoRes = await AxiosIntance.post("/claims/create", mongoPayload);

      const rawClaim =
        mongoRes?.data?.claim ||
        mongoRes?.data?.item ||
        mongoRes?.data?.data ||
        mongoRes?.data;

      const savedClaim = normalizeClaim(rawClaim);

      if (GOOGLE_SHEET_WEBHOOK) {
        try {
          await fetch(GOOGLE_SHEET_WEBHOOK, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              claim_category: formData.claimCategory || "",
              claim_url: formData.claimUrl || "",
              release_title: selectedRelease?.title || selectedRelease?.album || "",
              release_public_id: selectedRelease?.publicId || "",
              isrc: formData.isrc || "",
              cms_name: formData.cmsName || "",
              user_email: user?.email || "",
              user_name: user?.fullName || "",
              requested_at: new Date().toLocaleString(),
            }),
          });
        } catch (sheetError) {
          console.error("Google Sheet save failed:", sheetError);
        }
      }

      setClaims((prev) => [savedClaim, ...prev]);

      setFeedback({
        type: "success",
        message: "Claim created successfully.",
      });

      handleReset();
    } catch (error) {
      console.error("Claim submit error:", error?.response?.data || error.message);
      setFeedback({
        type: "error",
        message:
          error?.response?.data?.msg ||
          error?.response?.data?.message ||
          "Could not save claim. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="dash-page">
      <div className="dash-page-head">
        <div>
          <div className="text-sm dash-nav-label">YouTube</div>
          <h1 className="text-xl sm:text-2xl font-semibold">Create Claim</h1>
          <p className="text-sm mt-1 dash-muted">
            Submit claim requests with category, release title and ISRC in one place.
          </p>
        </div>
      </div>

      {feedback.message && (
        <div
          className={`mb-4 rounded-xl p-3 text-sm ${
            feedback.type === "success"
              ? "border border-green-400/40 bg-green-500/10"
              : "border border-red-400/40 bg-red-500/10"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="dash-card p-4 sm:p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Claim - Add Claim</h2>
          <p className="text-sm dash-muted">
            Fill all required fields to submit your claim request.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="dash-form space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[color:var(--muted)] mb-1">
                Claim Category <span className="text-red-500">*</span>
              </label>
              <select
                name="claimCategory"
                className="dash-select dash-select-themed"
                value={formData.claimCategory}
                onChange={handleInputChange}
                required
              >
                <option value="">- Select -</option>
                <option value="youtube">YouTube</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[color:var(--muted)] mb-1">
                Claim URL <span className="text-red-500">*</span>
              </label>
              <input
                name="claimUrl"
                type="url"
                className="dash-input"
                placeholder="Claim URL"
                value={formData.claimUrl}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[color:var(--muted)] mb-1">
                Release Title <span className="text-red-500">*</span>
              </label>
              <select
                name="releaseId"
                className="dash-select dash-select-themed"
                value={formData.releaseId}
                onChange={handleInputChange}
                required
              >
                <option value="">
                  {isLoadingReleases ? "Loading releases..." : "- Select Release -"}
                </option>
                {releaseOptions.map((release) => (
                  <option key={release._id} value={release._id}>
                    {release.title || release.album || release.publicId || "Untitled Release"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[color:var(--muted)] mb-1">
                ISRC <span className="text-red-500">*</span>
              </label>
              <input
                name="isrc"
                type="text"
                className="dash-input"
                placeholder="ISRC"
                value={formData.isrc}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[color:var(--muted)] mb-1">
                CMS Name <span className="text-red-500">*</span>
              </label>
              <input
                name="cmsName"
                type="text"
                className="dash-input"
                value={formData.cmsName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[color:var(--muted)] mb-1">
                User Email
              </label>
              <input
                type="email"
                className="dash-input"
                value={user?.email || ""}
                readOnly
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="dash-btn-secondary"
            >
              Reset
            </button>
            <button
              type="submit"
              className="dash-btn dash-btn-primary"
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      <div className="dash-card">
  <table className="dash-table">
    <thead>
      <tr>
        <th>Category</th>
        <th>Release</th>
        <th>URL</th>
        <th>ISRC</th>
        <th>CMS</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {claims.length === 0 ? (
        <tr>
          <td colSpan={6} className="text-center  py-8 dash-muted">
            No data available
          </td>
        </tr>
      ) : (
        claims.map((claim) => (
          <tr key={claim._id}>
            <td className="uppercase">{claim.claimCategory || "-"}</td>
            <td>{claim.releaseTitle || "-"}</td>
            <td className="break-all">{claim.claimUrl || "-"}</td>
            <td>{claim.isrc || "-"}</td>
            <td>{claim.cmsName || "-"}</td>
            <td>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${
                  claim.status === "approved"
                    ? "bg-green-500/15 text-green-600 border-green-500/30 dark:text-green-400"
                    : claim.status === "rejected"
                    ? "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400"
                    : "bg-yellow-500/15 text-yellow-600 border-yellow-500/30 dark:text-yellow-400"
                }`}
              >
                {claim.status || "pending"}
              </span>
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