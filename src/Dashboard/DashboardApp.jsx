// DashboardApp.jsx
import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router";

import NotificationsDrawer from "./components/NotificationsDrawer";
import ThemeToggle from "../components/ThemeToggle";

import {
  Music,
  FileText,
  Users,
  Tags,
  DollarSign,
  IndianRupee,
  User as UserIcon,
  Bell,
  LayoutDashboard,
  Plus,
  LogOut,
} from "lucide-react";

// IMPORTANT: ThemeProvider already wraps the whole app in src/main.jsx.
// Nesting another provider here would desync light/dark between public pages and /cms.
// ThemeProvider is already applied in src/main.jsx
import { FormStorageManager } from "./components/FormStorageManager";

import PrivateDashboard from "./pages/PrivateDashboard";
import Support from "./pages/Support";
import Legal from "./pages/Legal";
import MyArtists from "./pages/MyArtists";
import SubLabels from "./pages/SubLabels";
import Labels from "./pages/Labels";
import CallerTune from "./pages/CallerTune";
import ReleaseVideo from "./pages/ReleaseVideo";
import ReleaseMusic from "./pages/ReleaseMusic";
import CreateRelease from "./pages/CreateRelease";
import Finance from "./pages/Finance";
import UserProfile from "./pages/UserProfile";
import AdminRoute from "../components/AdminRoute";
import AdminTracks from "./pages/AdminTracks";
import AdminUsers from "./pages/AdminUsers";
import AdminPayments from "./pages/AdminPayments";
import AdminOverview from "./pages/AdminOverview";
import AdminClaims from "./pages/AdminClaims";
import AdminCallbacks from "./pages/AdminCallbacks";
import AdminNotification from "./pages/AdminNotification";

import {
  getMyNotificationsApi,
  markAllNotificationsReadApi,
  markNotificationReadApi,
  getActiveDashboardNoticeApi,
} from "../apis/NotificationApis";

import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "../features/reducers/AuthSlice";
import { logOutUserApi } from "../features/actions/AuthAction";
// === DASH NAV LINK (ADDED FIX) ===
function DashNavLink({ to, icon: Icon, children, active, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`dash-nav-item flex items-center gap-3 px-3 py-2 rounded-xl transition ${
        active ? "dash-nav-active" : ""
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{children}</span>
    </Link>
  );
}


// === THEME TOGGLE (optional) ===

// === SIDEBAR (RESPONSIVE) ===
function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showFormManager, setShowFormManager] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const profilePhoto = user?.dp;
  const initials =
    (user?.fullName && user.fullName[0]) ||
    (user?.email && user.email[0]) ||
    "U";

  const isActive = (path) => location.pathname === path;

const menuItems = [
  { name: "Dashboard", path: "/cms", icon: LayoutDashboard },

  { name: "Release Music", path: "/cms/release-music", icon: Music },
  { name: "Create Claim", path: "/cms/release-video", icon: Plus },
  { name: "Labels", path: "/cms/labels", icon: Tags },
  // ✅ Sub Labels
  { name: "Sub Labels", path: "/cms/sub-labels", icon: Tags },
  { name: "My Artists", path: "/cms/my-artists", icon: Users },

  // ✅ ADDED
  { name: "Finance", path: "/cms/finance", icon: IndianRupee },

  { name: "User Profile", path: "/cms/user-profile", icon: UserIcon },

  // ✅ ADMIN (rendered only if role=admin)
  { name: "Admin Overview", path: "/cms/admin/overview", icon: LayoutDashboard, adminOnly: true },
  { name: "Admin Tracks", path: "/cms/admin/tracks", icon: FileText, adminOnly: true },
  { name: "Admin Users", path: "/cms/admin/users", icon: Users, adminOnly: true },
  { name: "Admin Claims", path: "/cms/admin/claims", icon: FileText, adminOnly: true },
  { name: "Admin Payments", path: "/cms/admin/payments", icon: DollarSign, adminOnly: true },
  { name: "Admin Callbacks", path: "/cms/admin/callbacks", icon: Bell, adminOnly: true },
  { name: "Admin Notice", path: "/cms/admin/notification", icon: Bell, adminOnly: true },
];


  const handleCreate = () => {
    navigate("/cms/create-release");
    onClose?.();
  };

 const handleLogout = async () => {
  try {
    await dispatch(logOutUserApi());  // call API first
    dispatch(removeUser(null));       // then clear redux
    navigate("/", { replace: true });
  } catch (e) {
    console.log("logout error", e);
  }
};


  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(0,0,0,.55)" }}
        onClick={onClose}
      />

      {/* Sidebar drawer */}
      <aside
        className={`dash-sidebar fixed left-0 top-0 z-50 h-full w-[280px] md:w-[300px] p-5 overflow-y-auto transform transition-transform duration-200 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand + user */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl grid place-items-center dash-badge">
  <div className="brand-logo-shell h-9 w-9 rounded-full grid place-items-center">
              <img
                src="/newlogo1.png"
                alt="Silent Music Group logo"
                className="brand-logo-img h-7 w-7 object-contain"
              />
            </div>            </div>
            <div>
              <div className="text-sm font-semibold">Silent Music Group</div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>Artist Console</div>
            </div>
          </div>
        </div>

        {/* <div className="mt-5 flex items-center gap-3 rounded-2xl p-3 dash-card">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt={user?.fullName || "Profile"}
              className="w-10 h-10 rounded-xl object-cover"
              style={{ border: "1px solid var(--dash-border)" }}
            />
          ) : (
            <div className="w-10 h-10 rounded-xl grid place-items-center dash-badge font-semibold">
              {initials.toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">{user?.fullName || "User"}</div>
            <div className="text-xs truncate" style={{ color: "var(--muted)" }}>{user?.email || ""}</div>
          </div>
        </div> */}

        {/* Search
        <div className="mt-4 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
          <input
            className="dash-input w-full pl-9"
            placeholder="Search..."
            aria-label="Search"
          />
        </div> */}

        {/* Create */}
        <div className="mt-4 w-full mt-10 space-y-3">
          <button
            onClick={handleCreate}
            className="w-full dash-btn dash-btn-primary"
            type="button"
          >
            <Plus className="w-4 h-4" />
            Create Release
          </button>
        </div>

        {/* Nav */}
        <nav className="mt-6 space-y-1">
          <div className="dash-nav-label">OVERVIEW</div>
          <DashNavLink to="/cms" active={isActive("/cms") || location.pathname === "/cms"} onClick={onClose} icon={LayoutDashboard}>
            Dashboard
          </DashNavLink>

         <div className="dash-nav-label mt-5">CATALOG</div>
{menuItems
  .filter((m) =>
    [
      "/cms/release-music",
      "/cms/release-video",
      "/cms/labels",
      "/cms/sub-labels",
      "/cms/my-artists",
      "/cms/finance",
    ].includes(m.path)
  )
  .map((item) => (
    <DashNavLink
      key={item.path}
      to={item.path}
      active={isActive(item.path)}
      onClick={onClose}
      icon={item.icon}
    >
      {item.name}
    </DashNavLink>
  ))}


          {/* ADMIN */}
          {user?.role === "admin" && (
            <>
              <div className="dash-nav-label mt-5">ADMIN</div>
              {menuItems
                .filter((m) => m.adminOnly)
                .map((item) => (
                  <DashNavLink
                    key={item.path}
                    to={item.path}
                    active={isActive(item.path)}
                    onClick={onClose}
                    icon={item.icon}
                  >
                    {item.name}
                  </DashNavLink>
                ))}
            </>
          )}

          <div className="dash-nav-label mt-5">ACCOUNT</div>
          {menuItems
            .filter((m) => m.path === "/cms/user-profile")
            .map((item) => (
              <DashNavLink
                key={item.name}
                to={item.path}
                active={isActive(item.path)}
                onClick={onClose}
                icon={item.icon}
              >
                {item.name}
              </DashNavLink>
            ))}

          <button
            onClick={handleLogout}
            className="mt-6 w-full dash-btn dash-btn-danger"
            type="button"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Form manager (agar use karna ho) */}
      <FormStorageManager
        isOpen={showFormManager}
        onClose={() => setShowFormManager(false)}
      />
    </>
  );
}

// === MAIN DASHBOARD APP ===
function DashboardApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const lastNotifIdsRef = useState(() => new Set())[0];

  const { user } = useSelector((state) => state.auth);
  const [activeNotice, setActiveNotice] = useState(null);
  const [showNoticeBanner, setShowNoticeBanner] = useState(false);
  const dismissedNoticeKey = "cms_dismissed_notice_id";

  const fetchActiveNotice = async () => {
    try {
      const data = await getActiveDashboardNoticeApi();
      const notice = data?.notification || data?.item || null;

      if (!notice?._id) {
        setActiveNotice(null);
        setShowNoticeBanner(false);
        return;
      }

      setActiveNotice(notice);
      const dismissedId = localStorage.getItem(dismissedNoticeKey);
      setShowNoticeBanner(dismissedId !== String(notice._id));
    } catch (e) {
      // keep silent if backend notice endpoint fails
      setActiveNotice(null);
      setShowNoticeBanner(false);
    }
  };

  const dismissHolidayBanner = () => {
    if (activeNotice?._id) {
      localStorage.setItem(dismissedNoticeKey, String(activeNotice._id));
    }
    setShowNoticeBanner(false);
  };

  const profilePhoto = user?.dp;
  const initials =
    (user?.fullName && user.fullName[0]) ||
    (user?.email && user.email[0]) ||
    "U";

  const fetchNotifications = async ({ silent } = {}) => {
    try {
      if (!silent) setNotifLoading(true);
      const data = await getMyNotificationsApi({ limit: 30 });
      const list = data?.notifications || data?.items || data?.data || [];

      // Show toast only for NEW unread notifications (nice UX, not spammy)
      const nextIds = new Set();
      let unread = 0;
      (Array.isArray(list) ? list : []).forEach((n) => {
        const id = n?._id || n?.id;
        if (id) nextIds.add(id);
        if (!n?.read) unread += 1;
        if (id && !n?.read && !lastNotifIdsRef.has(id)) {
          toast.success(n?.title || "New notification");
        }
      });

      // replace tracking set
      lastNotifIdsRef.clear();
      nextIds.forEach((id) => lastNotifIdsRef.add(id));

      setNotifications(Array.isArray(list) ? list : []);
      setUnreadCount(unread);
    } catch (e) {
      // If backend doesn't have notifications yet, don't break the UI.
      // Keep it silent to avoid spamming errors.
    } finally {
      if (!silent) setNotifLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch + polling so user/admin gets updates after payment status changes
    fetchNotifications({ silent: true });
    fetchActiveNotice();
    const t = setInterval(() => fetchNotifications({ silent: true }), 20000);
    const noticeTimer = setInterval(() => fetchActiveNotice(), 20000);
    return () => {
      clearInterval(t);
      clearInterval(noticeTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (notifOpen) fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifOpen]);

  return (
      <div className="dash-shell dash-scope min-h-screen flex text-[color:var(--text)] overflow-x-hidden">
        {/* Sidebar (mobile + desktop) */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <NotificationsDrawer
          open={notifOpen}
          onClose={() => setNotifOpen(false)}
          notifications={notifications}
          loading={notifLoading}
          onMarkRead={async (id) => {
            if (!id) return;
            try {
              await markNotificationReadApi(id);
              setNotifications((prev) => prev.map((n) => ((n._id || n.id) === id ? { ...n, read: true } : n)));
              setUnreadCount((c) => Math.max(0, c - 1));
            } catch (e) {
              // ignore
            }
          }}
          onMarkAllRead={async () => {
            try {
              await markAllNotificationsReadApi();
              setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
              setUnreadCount(0);
            } catch (e) {
              // ignore
            }
          }}
        />
        {/* Right side content */}
        <div className="flex-1 min-w-0 flex flex-col min-h-screen md:ml-[300px] ml-0">
          {/* Top bar */}
          <header className="dash-header sticky top-0 z-20 flex items-center justify-between px-3 sm:px-6 py-3">
            {/* Hamburger only on mobile */}
              <button
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md border"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <div className="space-y-1">
                <span className="block h-0.5 w-5" style={{ background: "var(--text)" }} />
                <span className="block h-0.5 w-5" style={{ background: "var(--text)" }} />
                <span className="block h-0.5 w-5" style={{ background: "var(--text)" }} />
              </div>
            </button>

            <h1 className="text-sm sm:text-base font-semibold dash-nav-label mb-1 truncate max-w-[40vw] sm:max-w-none">Dashboard</h1>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setNotifOpen(true)}
                className="relative h-10 w-10 rounded-full grid place-items-center dash-card-soft text-[color:var(--text)] hover:opacity-90 -items-center dash-icon-btn"
                aria-label="Open notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 ? (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[11px] grid place-items-center bg-[color:var(--accent-1)] text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                ) : null}
              </button>

              {/* User info (right side) */}
              <div className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-full dash-card-soft">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt={user?.fullName || "Profile"}
                    className="w-8 h-8 rounded-full object-cover"
                    style={{ border: "1px solid var(--dash-border)" }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full grid place-items-center dash-badge text-xs font-semibold">
                    {initials.toUpperCase()}
                  </div>
                )}
                <div className="leading-tight">
                  <div className="text-sm font-semibold max-w-[160px] truncate">
                    {user?.fullName || "User"}
                  </div>
                  <div className="text-xs max-w-[160px] truncate" style={{ color: "var(--muted)" }}>
                    {user?.email || ""}
                  </div>
                </div>
              </div>

              <ThemeToggle />
            </div>
          </header>

          {/* Scrolling notices banner (protected routes) */}
          {showNoticeBanner && activeNotice?.message && (
            <div className="px-3 sm:px-6 mt-3">
              <div className="dash-card-soft p-3 rounded-2xl flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">📢 Admin Notice</div>
                  <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                    {activeNotice.message}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={dismissHolidayBanner}
                  className="dash-btn px-3 py-2"
                  style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text)" }}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Scrolling notices for all users */}
          {notifications.length > 0 && (
            <div className="px-3 sm:px-6 mt-3">
              <div className="dash-card-soft p-3 rounded-2xl">
                <div className="text-sm font-semibold mb-2">📢 Recent Notifications</div>
                <div className="space-y-2 max-h-[120px] overflow-y-auto pr-2">
                  {notifications.slice(0, 5).map((notif) => (
                    <div key={notif._id || notif.id} className="text-xs">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${notif.read ? 'bg-gray-300' : 'bg-blue-500'}`}></span>
                      <span className="text-sm">{notif.title || notif.message || 'Notification'}</span>
                      <span className="ml-2 text-xs" style={{ color: "var(--muted)" }}>
                        {new Date(notif.createdAt || notif.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main content */}
          <main className="flex-1 min-w-0 overflow-x-hidden px-3 sm:px-6 py-4 sm:py-6 overflow-y-auto">
            {/* Yaha /cms/* ke nested routes */}
            <Routes>
              {/* /cms */}
              <Route index element={<PrivateDashboard />} />
              {/* /cms/support */}
              <Route path="support" element={<Support />} />
              {/* /cms/legal */}
              <Route path="legal" element={<Legal />} />
              {/* /cms/my-artists */}
              <Route path="my-artists" element={<MyArtists />} />

              {/* /cms/sub-labels */}
              <Route path="sub-labels" element={<SubLabels />} />
              {/* /cms/labels */}
              <Route path="labels" element={<Labels />} />
              {/* /cms/caller-tune */}
              <Route path="caller-tune" element={<CallerTune />} />
              {/* /cms/release-video */}
              <Route path="release-video" element={<ReleaseVideo />} />
              {/* /cms/release-music */}
              <Route path="release-music" element={<ReleaseMusic />} />
              {/* /cms/create-release */}
              <Route path="create-release" element={<CreateRelease />} />
              {/* /cms/finance */}
              <Route path="finance" element={<Finance />} />
              {/* /cms/user-profile */}
              <Route path="user-profile" element={<UserProfile />} />

              {/* /cms/admin/tracks */}
              <Route
                path="admin/overview"
                element={
                  <AdminRoute>
                    <AdminOverview />
                  </AdminRoute>
                }
              />

              {/* /cms/admin/tracks */}
              <Route
                path="admin/tracks"
                element={
                  <AdminRoute>
                    <AdminTracks />
                  </AdminRoute>
                }
              />

              {/* /cms/admin/users */}
              <Route
                path="admin/users"
                element={
                  <AdminRoute>
                    <AdminUsers />
                  </AdminRoute>
                }
              />

              {/* /cms/admin/payments */}
              <Route
                path="admin/payments"
                element={
                  <AdminRoute>
                    <AdminPayments />
                  </AdminRoute>
                }
              />

              {/* /cms/admin/claims */}
              <Route
                path="admin/claims"
                element={
                  <AdminRoute>
                    <AdminClaims />
                  </AdminRoute>
                }
              />

              {/* /cms/admin/callbacks */}
              <Route
                path="admin/callbacks"
                element={
                  <AdminRoute>
                    <AdminCallbacks />
                  </AdminRoute>
                }
              />

              {/* /cms/admin/notification */}
              <Route
                path="admin/notification"
                element={
                  <AdminRoute>
                    <AdminNotification />
                  </AdminRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </div>
  );
}

export default DashboardApp;
