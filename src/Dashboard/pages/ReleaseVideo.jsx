import React, { useEffect, useMemo, useState } from "react";
import emailjs from "@emailjs/browser";
import { useSelector } from "react-redux";
import { EMAILJS_CONFIG } from "../../config/emailjs/emailjs";
import { fetchTracksApi } from "../../apis/TrackApis";

export default function ReleaseVideo() {
  const { user } = useSelector((state) => state.auth);
  const [isLoadingReleases, setIsLoadingReleases] = useState(false);
  const [releaseOptions, setReleaseOptions] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [claims, setClaims] = useState([]);

  const [formData, setFormData] = useState({
    claimCategory: "",
    claimUrl: "",
    releaseId: "",
    isrc: "",
    cmsName: "WMG",
  });

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
        console.error("Failed to load releases for claim form:", error);
      } finally {
        setIsLoadingReleases(false);
      }
    };

    loadUserReleases();
  }, []);

  const selectedRelease = useMemo(
    () => releaseOptions.find((r) => r._id === formData.releaseId),
    [releaseOptions, formData.releaseId]
  );

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

    const payload = {
      claim_category: formData.claimCategory,
      claim_url: formData.claimUrl,
      release_title: selectedRelease?.title || selectedRelease?.album || "",
      release_public_id: selectedRelease?.publicId || "",
      isrc: formData.isrc,
      cms_name: formData.cmsName,
      user_email: user?.email || "",
      user_name: user?.fullName || "",
      requested_at: new Date().toLocaleString(),
    };

    try {
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        payload,
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      setClaims((prev) => [payload, ...prev]);
      setFeedback({
        type: "success",
        message: "Claim created and sent successfully via EmailJS.",
      });
      handleReset();
    } catch (error) {
      console.error("EmailJS claim send error:", error);
      setFeedback({
        type: "error",
        message: "Could not send claim. Please check EmailJS config and try again.",
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
          <p className="text-sm dash-muted">Fill all required fields to submit your claim request.</p>
        </div>

        <form onSubmit={handleSubmit} className="dash-form space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[color:var(--muted)] mb-1">
                Claim Category <span className="text-red-500 text-">*</span>
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
              <label className="block text-sm font-medium text-[color:var(--muted)] mb-1">User Email</label>
              <input
                type="email"
                className="dash-input"
                value={user?.email || ""}
                readOnly
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={handleReset} className="dash-btn-secondary">
              Reset
            </button>
            <button type="submit" className="dash-btn dash-btn-primary" disabled={isSending}>
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
            </tr>
          </thead>
          <tbody>
            {claims.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 dash-muted">
                  No data available
                </td>
              </tr>
            ) : (
              claims.map((claim, index) => (
                <tr key={`${claim.claim_url}-${index}`}>
                  <td className="uppercase">{claim.claim_category}</td>
                  <td>{claim.release_title || "-"}</td>
                  <td>{claim.claim_url}</td>
                  <td>{claim.isrc || "-"}</td>
                  <td>{claim.cms_name || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
