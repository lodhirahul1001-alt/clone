export default function CookiePolicy() {
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
              background: "rgba(59, 130, 246, 0.1)",
              color: "#2563eb",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "14px",
            }}
          >
            Cookies & Tracking
          </div>

          <h1
            style={{
              fontSize: "38px",
              margin: "0 0 10px",
              color: "#111827",
              fontWeight: "700",
            }}
          >
            Cookies Policy
          </h1>

          <p style={{ color: "#6b7280", margin: 0 }}>
            Last updated: 2026
          </p>
        </div>

        {/* Sections */}

        <div style={sectionStyle}>
          <h3 style={{ marginBottom: "10px" }}>What Are Cookies</h3>
          <p style={{ margin: 0, color: "#4b5563", lineHeight: "1.8" }}>
            Cookies are small text files stored on your device that help improve
            your browsing experience by remembering preferences and enhancing
            performance.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3 style={{ marginBottom: "10px" }}>How We Use Cookies</h3>
          <ul
            style={{
              margin: 0,
              paddingLeft: "20px",
              color: "#4b5563",
              lineHeight: "2",
            }}
          >
            <li>To maintain secure login sessions</li>
            <li>To analyze website traffic and user behavior</li>
            <li>To enhance performance and user experience</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h3 style={{ marginBottom: "10px" }}>Third-Party Tools</h3>
          <p style={{ margin: 0, color: "#4b5563", lineHeight: "1.8" }}>
            We may use third-party services such as Google Analytics to collect
            and analyze information about how users interact with our website.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3 style={{ marginBottom: "10px" }}>Your Control</h3>
          <p style={{ margin: 0, color: "#4b5563", lineHeight: "1.8" }}>
            You can manage or disable cookies through your browser settings.
            Please note that disabling cookies may affect the functionality of
            certain parts of the website.
          </p>
        </div>
      </div>
    </div>
  );
}