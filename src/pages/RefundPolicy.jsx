export default function RefundPolicy() {
  const sectionStyle = {
    background: "rgba(255,255,255,0.7)",
    border: "1px solid rgba(255,255,255,0.4)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    borderRadius: "18px",
    padding: "20px",
    marginBottom: "18px",
    boxShadow: "0 8px 30px rgba(31, 38, 135, 0.08)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
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
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              display: "inline-block",
              padding: "8px 16px",
              borderRadius: "999px",
              background: "rgba(99, 102, 241, 0.12)",
              color: "#4f46e5",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "14px",
            }}
          >
            Legal Information
          </div>

          <h1
            style={{
              fontSize: "38px",
              margin: "0 0 10px",
              color: "#111827",
              fontWeight: "700",
              letterSpacing: "-0.5px",
            }}
          >
            Refund Policy
          </h1>

          <p
            style={{
              color: "#6b7280",
              fontSize: "15px",
              margin: 0,
            }}
          >
            Last updated: 2026
          </p>
        </div>

        <div
          style={{
            ...sectionStyle,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(243,244,255,0.75))",
          }}
        >
          <p
            style={{
              fontSize: "17px",
              lineHeight: "1.8",
              color: "#374151",
              margin: 0,
            }}
          >
            Silent Music Group provides digital music services including
            distribution, analytics, and platform access. This Refund Policy
            explains when refunds may be granted and which services are
            non-refundable.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3
            style={{
              marginTop: 0,
              marginBottom: "12px",
              color: "#111827",
              fontSize: "22px",
            }}
          >
            1. Refund Eligibility
          </h3>
          <p style={{ margin: 0, color: "#4b5563", lineHeight: "1.8" }}>
            Refunds are only applicable if the purchased service has not been
            delivered, activated, processed, or submitted for execution.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3
            style={{
              marginTop: 0,
              marginBottom: "12px",
              color: "#111827",
              fontSize: "22px",
            }}
          >
            2. Non-Refundable Services
          </h3>

          <ul
            style={{
              margin: 0,
              paddingLeft: "20px",
              color: "#4b5563",
              lineHeight: "2",
            }}
          >
            <li>Music distribution services once a release has been submitted</li>
            <li>Account subscriptions and recurring service plans</li>
            <li>Digital downloads, reports, or analytics access</li>
            <li>Any completed promotional or platform-related service</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h3
            style={{
              marginTop: 0,
              marginBottom: "12px",
              color: "#111827",
              fontSize: "22px",
            }}
          >
            3. Processing Time
          </h3>
          <p style={{ margin: 0, color: "#4b5563", lineHeight: "1.8" }}>
            If a refund request is approved, the amount will be processed within{" "}
            <strong style={{ color: "#111827" }}>5–10 business days</strong>,
            depending on your payment provider or bank.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3
            style={{
              marginTop: 0,
              marginBottom: "12px",
              color: "#111827",
              fontSize: "22px",
            }}
          >
            4. Contact Us
          </h3>
          <p style={{ margin: 0, color: "#4b5563", lineHeight: "1.8" }}>
            For any refund-related questions, please contact us at{" "}
            <a
              href="mailto:support@silentmusicgroup.com"
              style={{
                color: "#4f46e5",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              support@silentmusicgroup.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}