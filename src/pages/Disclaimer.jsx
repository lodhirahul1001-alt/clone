export default function Disclaimer() {
  const sectionStyle = {
    background: "rgba(255,255,255,0.7)",
    border: "1px solid rgba(255,255,255,0.4)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    borderRadius: "18px",
    padding: "20px",
    marginBottom: "18px",
    boxShadow: "0 8px 30px rgba(31, 38, 135, 0.08)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f5f7ff 0%, #e8ecff 35%, #fdf2f8 100%)",
        padding: "50px 20px",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.55)",
          border: "1px solid rgba(255,255,255,0.35)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderRadius: "28px",
          padding: "40px 28px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              display: "inline-block",
              padding: "8px 16px",
              borderRadius: "999px",
              background: "rgba(239, 68, 68, 0.1)",
              color: "#dc2626",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "14px",
            }}
          >
            Legal Notice
          </div>

          <h1
            style={{
              fontSize: "38px",
              margin: "0 0 10px",
              color: "#111827",
              fontWeight: "700",
            }}
          >
            Disclaimer
          </h1>

          <p style={{ color: "#6b7280", margin: 0 }}>
            Last updated: 2026
          </p>
        </div>

        {/* Sections */}

        <div style={sectionStyle}>
          <h3 style={{ marginBottom: "10px" }}>No Guarantee</h3>
          <p style={{ margin: 0, color: "#4b5563", lineHeight: "1.8" }}>
            Silent Music Group does not guarantee success, streams, earnings,
            or platform growth for any music uploaded or distributed through
            our services.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3 style={{ marginBottom: "10px" }}>Third-Party Platforms</h3>
          <p style={{ margin: 0, color: "#4b5563", lineHeight: "1.8" }}>
            We are not responsible for the policies, actions, or changes made
            by third-party platforms such as Spotify, YouTube, Apple Music,
            or other distribution partners.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3 style={{ marginBottom: "10px" }}>User Responsibility</h3>
          <p style={{ margin: 0, color: "#4b5563", lineHeight: "1.8" }}>
            Users are solely responsible for ensuring that all uploaded content
            is original, properly licensed, and does not violate copyright,
            trademark, or intellectual property laws.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3 style={{ marginBottom: "10px" }}>Limitation of Liability</h3>
          <p style={{ margin: 0, color: "#4b5563", lineHeight: "1.8" }}>
            Silent Music Group shall not be held liable for any direct,
            indirect, incidental, or consequential damages arising from the
            use of our services.
          </p>
        </div>
      </div>
    </div>
  );
}