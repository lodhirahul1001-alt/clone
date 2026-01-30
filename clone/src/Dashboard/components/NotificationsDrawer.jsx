import { X, Bell } from "lucide-react";

const demoNotifications = [
  { id: 1, title: "New release submitted", desc: "Your release is in review.", time: "Just now" },
  { id: 2, title: "Payout processed", desc: "Your payout request was approved.", time: "Today" },
  { id: 3, title: "Support update", desc: "A support agent replied to your ticket.", time: "Yesterday" },
];

export default function NotificationsDrawer({ open, onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={
          "fixed inset-0 z-40 bg-black/40 transition-opacity " +
          (open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")
        }
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={
          "fixed right-0 top-0 z-50 h-full w-full max-w-sm transform transition-transform duration-200 " +
          (open ? "translate-x-0" : "translate-x-full")
        }
        aria-hidden={!open}
      >
        <div className="h-full glass rounded-none border-l border-white/10">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <div className="font-semibold">Notifications</div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-10 w-10 rounded-full grid place-items-center border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
              aria-label="Close notifications"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            {demoNotifications.map((n) => (
              <div key={n.id} className="glass-soft p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium">{n.title}</div>
                  <div className="text-xs text-[color:var(--muted)]">{n.time}</div>
                </div>
                <div className="mt-1 text-sm text-[color:var(--muted)]">{n.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
