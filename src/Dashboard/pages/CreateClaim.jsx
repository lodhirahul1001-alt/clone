import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchTracksApi } from "../../apis/TrackApis";
import { AxiosIntance } from "../../config/Axios.Intance";

export default function CreateClaim() {
  const { user } = useSelector((state) => state.auth);
  const [isLoadingReleases, setIsLoadingReleases] = useState(false);
  const [releaseOptions, setReleaseOptions] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [claims, setClaims] = useState([]);

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

  const loadUserReleases = async () => {
    try {
      setIsLoadingReleases(true);
      const res = await fetchTracksApi({ page: 1, limit: 200, search: "", status: "all", sortBy: "createdAt", sortOrder: "desc" });
      setReleaseOptions(res?.tracks || []);
    } catch (error) {
      console.error("Failed to load releases for claim form:", error);
    } finally {
      setIsLoadingReleases(false);
    }
  };

  const loadMyClaims = async () => {
    try {
      const res = await AxiosIntance.get("/claims/my");
      setClaims(res?.data?.claims || []);
    } catch (e) {
      setClaims([]);
    }
  };

  useEffect(() => {
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
    setFormData({ claimCategory: "", claimUrl: "", releaseId: "", isrc: "", cmsName: "WMG" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const payload = {
        claimCategory: formData.claimCategory,
        claimUrl: formData.claimUrl,
        releaseId: formData.releaseId || undefined,
        releaseTitle: selectedRelease?.title || selectedRelease?.album || "",
        releasePublicId: selectedRelease?.publicId || "",
        isrc: formData.isrc || "",
        cmsName: formData.cmsName || "",
      };
      const mongoRes = await AxiosIntance.post("/claims/create", payload);
      const savedClaim = mongoRes?.data?.claim;


    const payload = {
      claimCategory: formData.claimCategory || "",
      claimUrl: formData.claimUrl || "",
      releaseTitle: selectedRelease?.title || selectedRelease?.album || "",
      releasePublicId: selectedRelease?.publicId || "",
      isrc: formData.isrc || "",
      cmsName: formData.cmsName || "",
      user: {
        email: user?.email || "",
        fullName: user?.fullName || "",
      },
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      // ✅ 1) Save to MongoDB (primary)
      const mongoRes = await AxiosIntance.post("/claims", payload);
      console.log("Claim saved to MongoDB:", mongoRes.data);

      // ✅ 2) Save to Google Sheet (best-effort)

      if (GOOGLE_SHEET_WEBHOOK) {
        try {
          await fetch(GOOGLE_SHEET_WEBHOOK, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              claim_category: formData.claimCategory,
              claim_url: formData.claimUrl,
              release_title: payload.releaseTitle,
              release_public_id: payload.releasePublicId,
              isrc: formData.isrc,
              cms_name: formData.cmsName,

              claim_category: formData.claimCategory || "",
              claim_url: formData.claimUrl || "",
              release_title: payload.releaseTitle,
              release_public_id: payload.releasePublicId,
              isrc: formData.isrc || "",
              cms_name: formData.cmsName || "",

              user_email: user?.email || "",
              user_name: user?.fullName || "",
              requested_at: new Date().toLocaleString(),
            }),
          });
        } catch {}
      }
      if (savedClaim) setClaims((prev) => [savedClaim, ...prev]);
      toast.success("Claim submitted successfully");
      handleReset();
    } catch (error) {
      console.error("Claim submit error:", error);
      toast.error(error?.response?.data?.msg || "Could not save claim. Please try again.");

          console.log("Claim saved to Google Sheets");
        } catch (sheetError) {
          console.error("Google Sheet save failed:", sheetError);
          // Don't fail the whole operation for sheet error
        }
      }

      const savedClaim = mongoRes?.data?.claim || mongoRes?.data;
      if (savedClaim) {
        setClaims((prev) => [savedClaim, ...prev]);
      }

      setFeedback({
        type: "success",
        message: "Claim created successfully and saved to both MongoDB and Google Sheet.",
      });

      handleReset();
    } catch (error) {
      console.error("Claim submit error:", error);
      console.error("Error details:", error.response?.data || error.message);

      setFeedback({
        type: "error",
        message: error.response?.data?.msg || error.message || "Could not save claim. Please try again.",
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
          <p className="text-sm mt-1 dash-muted">Submit claim requests with category, release title and ISRC in one place.</p>
        </div>
      </div>

      <div className="dash-card p-4 sm:p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Claim - Add Claim</h2>
          <p className="text-sm dash-muted">Fill all required fields to submit your claim request.</p>
        </div>

        <form onSubmit={handleSubmit} className="dash-form space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[color:var(--muted)] mb-1">Claim Category <span className="text-red-500">*</span></label>
              <select name="claimCategory" className="dash-select dash-select-themed" value={formData.claimCategory} onChange={handleInputChange} required>
                <option value="">- Select -</option>
                <option value="youtube">YouTube</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[color:var(--muted)] mb-1">Claim URL <span className="text-red-500">*</span></label>
              <input name="claimUrl" type="url" className="dash-input" placeholder="Claim URL" value={formData.claimUrl} onChange={handleInputChange} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-[color:var(--muted)] mb-1">Release Title <span className="text-red-500">*</span></label>
              <select name="releaseId" className="dash-select dash-select-themed" value={formData.releaseId} onChange={handleInputChange} required>
                <option value="">{isLoadingReleases ? "Loading releases..." : "- Select Release -"}</option>
                {releaseOptions.map((release) => (
                  <option key={release._id} value={release._id}>
                    {release.title || release.album || release.publicId || "Untitled Release"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[color:var(--muted)] mb-1">ISRC <span className="text-red-500">*</span></label>
              <input name="isrc" type="text" className="dash-input" placeholder="ISRC" value={formData.isrc} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[color:var(--muted)] mb-1">CMS Name <span className="text-red-500">*</span></label>
              <input name="cmsName" type="text" className="dash-input" value={formData.cmsName} onChange={handleInputChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[color:var(--muted)] mb-1">User Email</label>
              <input type="email" className="dash-input" value={user?.email || ""} readOnly />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={handleReset} className="dash-btn-secondary">Reset</button>
            <button type="submit" className="dash-btn dash-btn-primary" disabled={isSending}>{isSending ? "Sending..." : "Submit"}</button>
          </div>
        </form>
      </div>

      <div className="dash-card p-4 sm:p-6">
        <h2 className="text-lg font-semibold">My Claims</h2>
        <p className="text-sm dash-muted">Your recent claim requests saved in your account.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: "var(--muted)" }}>
                <th className="text-left p-2">Category</th>
                <th className="text-left p-2">Release</th>
                <th className="text-left p-2">ISRC</th>
                <th className="text-left p-2">URL</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {claims.length === 0 ? (
                <tr><td className="p-2" colSpan={5}>No claims yet</td></tr>
              ) : (
                claims.slice(0, 20).map((c, i) => (
                  <tr key={c._id || i} style={{ borderTop: "1px solid var(--dash-border)" }}>
                    <td className="p-2 capitalize">{c.claimCategory || "-"}</td>
                    <td className="p-2">{c.releaseTitle || "-"}</td>
                    <td className="p-2">{c.isrc || "-"}</td>
                    <td className="p-2 max-w-[280px] truncate"><a className="underline" href={c.claimUrl} target="_blank" rel="noreferrer">{c.claimUrl}</a></td>
                    <td className="p-2"><span className="px-2 py-1 capitalize rounded-lg dash-badge">{c.status || "pending"}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
