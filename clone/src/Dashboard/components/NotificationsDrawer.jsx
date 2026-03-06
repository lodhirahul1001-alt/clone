import { X, Bell, CheckCheck } from "lucide-react";

function formatTime(ts) {
  try {
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString();
  } catch {
    return "";
  }
}

export default function NotificationsDrawer({
  open,
  onClose,
  notifications = [],
  loading = false,
  onMarkRead,
  onMarkAllRead,
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={
          "fixed inset-0 z-[60] bg-black/40 transition-opacity " +
          (open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")
        }
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={
          "fixed right-0 top-0 z-[70] h-full w-full max-w-sm transform transition-transform duration-200 " +
          (open ? "translate-x-0" : "translate-x-full")
        }
        aria-hidden={!open}
      >
        <div className="h-full dash-card rounded-none border-l border-[color:var(--border)] flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--border)]">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <div className="font-semibold">Notifications</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onMarkAllRead}
                className="h-10 px-3 rounded-full inline-flex items-center gap-2 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm"
                aria-label="Mark all as read"
                disabled={!notifications?.length}
              >
                <CheckCheck className="h-4 w-4" />
                Read all
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-10 w-10 rounded-full grid place-items-center border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="Close notifications"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-[calc(env(safe-area-inset-bottom)+16px)]">
            {loading ? (
              <div className="text-sm text-[color:var(--muted)]">Loading...</div>
            ) : notifications?.length ? (
              notifications.map((n) => (
                <button
                  key={n._id || n.id}
                  type="button"
                  onClick={() => onMarkRead?.(n._id || n.id)}
                  className={
                    "w-full text-left glass-soft p-4 transition " +
                    (n.read ? "opacity-80" : "ring-1 ring-[color:var(--accent-1)]/30")
                  }
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium">{n.title || "Notification"}</div>
                    <div className="text-xs text-[color:var(--muted)]">
                      {n.time || formatTime(n.createdAt)}
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-[color:var(--muted)]">
                    {n.desc || n.message || ""}
                  </div>
                </button>
              ))
            ) : (
              <div className="text-sm text-[color:var(--muted)]">No notifications yet.</div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
