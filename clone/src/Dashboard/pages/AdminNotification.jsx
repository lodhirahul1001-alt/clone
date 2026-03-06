import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminGetNotificationsApi, adminSetNotificationApi, adminDeleteNotificationApi } from "../../apis/AdminApis";

export default function AdminNotification() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const load = async () => {
    try {
      const res = await adminGetNotificationsApi();
      setHistory(res?.items || []);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (!message.trim()) return toast.error("Enter message");
    try {
      setLoading(true);
      await adminSetNotificationApi({ message: message.trim(), active: true });
      toast.success("Notification updated");
      setMessage("");
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;
    try {
      await adminDeleteNotificationApi(id);
      toast.success("Notification deleted");
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed to delete");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Admin · Notification Bar</h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Set the latest announcement shown on dashboard.
        </p>
      </div>

      <div className="dash-card p-4 sm:p-6">
        <label className="text-sm" style={{ color: "var(--muted)" }}>Message</label>
        <textarea
          className="dash-input mt-2"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Holiday update..."
        />
        <button className="btn-primary mt-3" type="button" onClick={submit} disabled={loading}>
          {loading ? "Saving..." : "Set Notification"}
        </button>
      </div>

      <div className="dash-card p-4 sm:p-6">
        <h2 className="text-lg font-semibold">History</h2>
        <div className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
          Total: {history.length}
        </div>
        <div className="mt-3 space-y-2 max-h-[420px] overflow-y-auto pr-1">
          {history.length === 0 ? (
            <div className="text-sm" style={{ color: "var(--muted)" }}>No notifications yet</div>
          ) : (
            history.map((n) => (
              <div key={n._id} className="glass-soft p-3 rounded-2xl">
                <div className="text-sm">{n.message}</div>
                <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  {n.active ? "Active" : "Inactive"} · {new Date(n.createdAt).toLocaleString()}
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    className="btn-primary mt-2 text-xs"
                    type="button"
                    onClick={async () => {
                      try {
                        await adminSetNotificationApi({ message: n.message, active: true });
                        toast.success("Notification activated");
                        await load();
                      } catch (e) {
                        toast.error(e?.response?.data?.msg || "Failed to activate");
                      }
                    }}
                  >
                    Activate
                  </button>
                  <button
                    className="btn-danger mt-2 text-xs"
                    type="button"
                    onClick={() => handleDelete(n._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
