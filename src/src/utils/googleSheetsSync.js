const normalizeFormType = (formType = "default") =>
  String(formType)
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_");

const sanitizeData = (data = {}) => {
  const cleaned = {};

  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      cleaned[key] = value.name;
      return;
    }

    if (Array.isArray(value)) {
      cleaned[key] = value.map((item) => (item instanceof File ? item.name : item));
      return;
    }

    cleaned[key] = value;
  });

  return cleaned;
};

const getWebhookUrl = (formType) => {
  const normalizedType = normalizeFormType(formType);
  const specificKey = `VITE_GOOGLE_SHEET_WEBHOOK_${normalizedType}`;
  return import.meta.env[specificKey] || import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_DEFAULT || "";
};

export async function postFormEntryToGoogleSheet({
  formType,
  formTitle,
  data,
  status = "submitted",
  userInfo,
}) {
  const webhookUrl = getWebhookUrl(formType);
  if (!webhookUrl) return;

  const payload = {
    formType,
    formTitle,
    status,
    submittedAt: new Date().toISOString(),
    userInfo: userInfo || {},
    data: sanitizeData(data),
  };

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error(`Google Sheet sync failed for ${formType}:`, error);
  }
}
