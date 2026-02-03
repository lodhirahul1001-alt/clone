import UploadTrack from "../components/UploadTrack";

export default function CreateRelease() {
  return (
    <div className="dash-page">
      <div className="dash-page-head">
        <div>
          <div className="text-xs uppercase tracking-widest" style={{ color: "var(--muted)" }}>
            New Release
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold mt-1">Upload New Track</h1>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            Distribute to all major platforms, keep 100% of your rights, and track performance in real time.
          </p>
        </div>
      </div>

      {/* Embedded (no overlay) so theme toggle works correctly */}
      <UploadTrack view="page" />
    </div>
  );
}
