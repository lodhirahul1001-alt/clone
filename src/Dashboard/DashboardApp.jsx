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

import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "../features/reducers/AuthSlice";
import { logOutUserApi } from "../features/actions/AuthAction";
// ================= DASH NAV LINK (ADDED FIX) =================
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


// ================= THEME TOGGLE (optional) =================

// ================= SIDEBAR (RESPONSIVE) =================
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
  { name: "Labels", path: "/cms/labels", icon: Tags },
  // ✅ Sub Labels
  { name: "Sub Labels", path: "/cms/sub-labels", icon: Tags },
  { name: "My Artists", path: "/cms/my-artists", icon: Users },

  // ✅ ADDED
  { name: "Finance", path: "/cms/finance", icon: DollarSign },

  { name: "User Profile", path: "/cms/user-profile", icon: UserIcon },

  // ✅ ADMIN (rendered only if role=admin)
  { name: "Admin Tracks", path: "/cms/admin/tracks", icon: FileText, adminOnly: true },
  { name: "Admin Users", path: "/cms/admin/users", icon: Users, adminOnly: true },
];


  const handleCreate = () => {
    navigate("/cms/create-release");
    onClose?.();
  };

 const handleLogout = async () => {
  try {
    await dispatch(logOutUserApi());  // call API first
    dispatch(removeUser(null));       // then clear redux
    navigate("/");
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
        className={`dash-sidebar fixed left-0 top-0 z-50 h-full w-[280px] md:w-[300px] p-5 transform transition-transform duration-200 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand + user */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl grid place-items-center dash-badge">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">PR DIGITAL CMS</div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>Artist Console</div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-2xl p-3 dash-card">
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
        </div>

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
        <button
          onClick={handleCreate}
          className="mt-4 w-full dash-btn dash-btn-primary"
          type="button"
        >
          <Plus className="w-4 h-4" />
          Create Release
        </button>

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

// ================= MAIN DASHBOARD APP =================
function DashboardApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const [holidayBanner, setHolidayBanner] = useState(true);

  useEffect(() => {
    const v = localStorage.getItem("cms_holiday_banner_dismissed");
    if (v === "1") setHolidayBanner(false);
  }, []);

  const dismissHolidayBanner = () => {
    setHolidayBanner(false);
    localStorage.setItem("cms_holiday_banner_dismissed", "1");
  };

  const profilePhoto = user?.dp;
  const initials =
    (user?.fullName && user.fullName[0]) ||
    (user?.email && user.email[0]) ||
    "U";

  return (
      <div className="dash-shell dash-scope min-h-screen flex text-[color:var(--text)]">
        {/* Sidebar (mobile + desktop) */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <NotificationsDrawer open={notifOpen} onClose={() => setNotifOpen(false)} />
        {/* Right side content */}
        <div className="flex-1 flex flex-col min-h-screen md:ml-[300px] ml-0 mt-1">
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
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[color:var(--accent-1)]"></span>
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

          {/* Holiday update banner (protected routes) */}
          {holidayBanner && (
            <div className="px-3 sm:px-6 mt-3">
              <div className="dash-card-soft p-3 rounded-2xl flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">🎉 Holiday Update</div>
                  <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                    We’ve improved payouts, faster verification, and added Sub-Labels management. If you face any issue, raise a support ticket.
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

          {/* Main content */}
          <main className="flex-1 px-3 sm:px-6 py-4 sm:py-6 overflow-y-auto">
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
            </Routes>
          </main>
        </div>
      </div>
  );
}

export default DashboardApp;
