// DashboardApp.jsx
import { useState } from "react";
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

// ================= DASH NAV LINK =================
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

// ================= SIDEBAR =================
function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showFormManager, setShowFormManager] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { name: "Dashboard", path: "/cms", icon: LayoutDashboard },
    { name: "Release Music", path: "/cms/release-music", icon: Music },
    { name: "Labels", path: "/cms/labels", icon: Tags },
    { name: "Sub Labels", path: "/cms/sub-labels", icon: Tags },
    { name: "My Artists", path: "/cms/my-artists", icon: Users },
    { name: "Finance", path: "/cms/finance", icon: DollarSign },
    { name: "User Profile", path: "/cms/user-profile", icon: UserIcon },
    { name: "Admin Tracks", path: "/cms/admin/tracks", icon: FileText, adminOnly: true },
    { name: "Admin Users", path: "/cms/admin/users", icon: Users, adminOnly: true },
  ];

  const handleCreate = () => {
    navigate("/cms/create-release");
    onClose?.();
  };

  const handleLogout = async () => {
    try {
      await dispatch(logOutUserApi());
      dispatch(removeUser(null));
      navigate("/");
    } catch (e) {
      console.log("logout error", e);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(0,0,0,.55)" }}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`dash-sidebar fixed left-0 top-0 z-40 h-full w-64 p-5
        transform transition-transform duration-200
        md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl grid place-items-center dash-badge">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">PR DIGITAL CMS</div>
            <div className="text-xs text-muted">Artist Console</div>
          </div>
        </div>

        <button
          onClick={handleCreate}
          className="mt-4 w-full dash-btn dash-btn-primary"
        >
          <Plus className="w-4 h-4" />
          Create Release
        </button>

        <nav className="mt-6 space-y-1">
          <div className="dash-nav-label">OVERVIEW</div>
          <DashNavLink
            to="/cms"
            icon={LayoutDashboard}
            active={isActive("/cms")}
            onClick={onClose}
          >
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
                icon={item.icon}
                active={isActive(item.path)}
                onClick={onClose}
              >
                {item.name}
              </DashNavLink>
            ))}

          {user?.role === "admin" && (
            <>
              <div className="dash-nav-label mt-5">ADMIN</div>
              {menuItems
                .filter((m) => m.adminOnly)
                .map((item) => (
                  <DashNavLink
                    key={item.path}
                    to={item.path}
                    icon={item.icon}
                    active={isActive(item.path)}
                    onClick={onClose}
                  >
                    {item.name}
                  </DashNavLink>
                ))}
            </>
          )}

          <button
            onClick={handleLogout}
            className="mt-6 w-full dash-btn dash-btn-danger"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </nav>
      </aside>

      <FormStorageManager
        isOpen={showFormManager}
        onClose={() => setShowFormManager(false)}
      />
    </>
  );
}

// ================= MAIN DASHBOARD =================
function DashboardApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // ✅ FIX: user now exists here
  const { user } = useSelector((state) => state.auth);

  const profilePhoto = user?.dp;
  const initials =
    (user?.fullName && user.fullName[0]) ||
    (user?.email && user.email[0]) ||
    "U";

  return (
    <div className="dash-shell min-h-screen flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <NotificationsDrawer open={notifOpen} onClose={() => setNotifOpen(false)} />

      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header */}
        <header className="dash-header sticky top-0 z-20 flex items-center justify-between px-4 py-3">
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md border"
            onClick={() => setSidebarOpen(true)}
          >
            <div className="space-y-1">
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
            </div>
          </button>

          <h1 className="text-sm sm:text-base font-semibold">Dashboard</h1>

          {/* RIGHT SIDE FIXED */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setNotifOpen(true)}
              className="h-9 w-9 rounded-full grid place-items-center dash-icon-btn"
            >
              <Bell className="h-5 w-5" />
            </button>

            <ThemeToggle />

            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="profile"
                className="h-9 w-9 rounded-full object-cover border"
              />
            ) : (
              <div className="h-9 w-9 rounded-full grid place-items-center dash-badge font-semibold">
                {initials}
              </div>
            )}
          </div>
        </header>

        {/* Pages */}
        <main className="flex-1 px-4 py-3 overflow-y-auto">
          <Routes>
            <Route index element={<PrivateDashboard />} />
            <Route path="support" element={<Support />} />
            <Route path="legal" element={<Legal />} />
            <Route path="my-artists" element={<MyArtists />} />
            <Route path="sub-labels" element={<SubLabels />} />
            <Route path="labels" element={<Labels />} />
            <Route path="caller-tune" element={<CallerTune />} />
            <Route path="release-video" element={<ReleaseVideo />} />
            <Route path="release-music" element={<ReleaseMusic />} />
            <Route path="create-release" element={<CreateRelease />} />
            <Route path="finance" element={<Finance />} />
            <Route path="user-profile" element={<UserProfile />} />

            <Route
              path="admin/tracks"
              element={
                <AdminRoute>
                  <AdminTracks />
                </AdminRoute>
              }
            />
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
