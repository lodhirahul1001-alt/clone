export default function Terms() {
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
              background: "rgba(16, 185, 129, 0.1)",
              color: "#059669",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "14px",
            }}
          >
            Legal Agreement
          </div>

          <h1
            style={{
              fontSize: "38px",
              margin: "0 0 10px",
              color: "#111827",
              fontWeight: "700",
            }}
          >
            Terms & Conditions
          </h1>

          <p style={{ color: "#6b7280", margin: 0 }}>
            Last updated: 2026
          </p>
        </div>

        {/* Intro */}
        <div style={sectionStyle}>
          <p style={{ margin: 0, color: "#4b5563", lineHeight: "1.8" }}>
            Welcome to Silent Music Group. By using our website and services,
            you agree to comply with the following terms and conditions.
          </p>
        </div>

        {/* Sections */}

        <div style={sectionStyle}>
          <h3>1. Use of Service</h3>
          <p style={{ margin: 0, color: "#4b5563" }}>
            Silent Music Group provides music distribution, analytics, and
            digital services. Users must use the platform legally and responsibly.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3>2. User Accounts</h3>
          <ul style={{ paddingLeft: "20px", color: "#4b5563", lineHeight: "2" }}>
            <li>You must provide accurate information</li>
            <li>You are responsible for maintaining account security</li>
            <li>We may suspend accounts for misuse</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h3>3. Content Ownership</h3>
          <p style={{ margin: 0, color: "#4b5563" }}>
            Users retain ownership of their uploaded music. However, by uploading,
            you grant us permission to distribute and manage your content.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3>4. Prohibited Content</h3>
          <ul style={{ paddingLeft: "20px", color: "#4b5563", lineHeight: "2" }}>
            <li>Copyrighted content without permission</li>
            <li>Illegal, harmful, or offensive content</li>
            <li>Fake or misleading information</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h3>5. Copyright Policy</h3>
          <p style={{ margin: 0, color: "#4b5563" }}>
            We respect copyright laws. If any content violates rights, we may
            remove it without notice and suspend the account.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3>6. Payments & Refunds</h3>
          <p style={{ margin: 0, color: "#4b5563" }}>
            All payments for digital services are non-refundable unless stated
            in our Refund Policy.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3>7. Service Availability</h3>
          <p style={{ margin: 0, color: "#4b5563" }}>
            We do not guarantee uninterrupted access. Services may change or be
            updated at any time.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3>8. Third-Party Services</h3>
          <p style={{ margin: 0, color: "#4b5563" }}>
            We are not responsible for third-party platforms such as Spotify,
            YouTube, Apple Music, or others.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3>9. Limitation of Liability</h3>
          <p style={{ margin: 0, color: "#4b5563" }}>
            Silent Music Group is not liable for any losses, damages, or missed
            opportunities resulting from the use of our platform.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3>10. Termination</h3>
          <p style={{ margin: 0, color: "#4b5563" }}>
            We reserve the right to suspend or terminate accounts that violate
            our policies.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3>11. Changes to Terms</h3>
          <p style={{ margin: 0, color: "#4b5563" }}>
            We may update these terms at any time. Continued use of our services
            means acceptance of the updated terms.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3>12. Contact</h3>
          <p style={{ margin: 0, color: "#4b5563" }}>
            Email:{" "}
            <a
              href="mailto:silentmusicindia@gmail.com"
              style={{ color: "#059669", fontWeight: "600", textDecoration: "none" }}
            >
              silentmusicindia@gmai.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}