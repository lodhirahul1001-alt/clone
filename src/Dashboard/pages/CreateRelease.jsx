import UploadTrack from "../components/UploadTrack";

export default function CreateRelease() {
  return (
    <div className="">


      {/* Embedded (no overlay) so theme toggle works correctly */}
      <UploadTrack view="page" />
    </div>
  );
}
