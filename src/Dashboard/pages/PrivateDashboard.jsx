import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router";
import {
  Wallet,
  Receipt,
  Clock,
  Trophy,
  Music2,
  BadgeCheck,
  Video,
  Award,
} from "lucide-react";

function StatCard({ icon: Icon, title, value, sub }) {
  return (
    <div className="dash-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>
            {title}
          </div>
          <div className="mt-2 text-2xl font-semibold">{value}</div>
          {sub ? (
            <div className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
              {sub}
            </div>
          ) : null}
        </div>
        <div className="dash-icon-badge">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

function GradientCard({ title, value, icon: Icon, variant = "a" }) {
  return (
    <div className={`dash-gradient dash-gradient-${variant}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-[color:var(--text)]/90">{title}</div>
          <div className="mt-3 text-3xl font-bold text-[color:var(--text)]">{value}</div>
        </div>
        <div className="dash-gradient-icon">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

export default function PrivateDashboard() {
  const { user } = useSelector((state) => state.auth);
  const userName = user?.fullName || user?.name || user?.email?.split("@")[0] || "User";

  // Demo numbers (wire with real API later)
  const summary = useMemo(
    () => ({
      totalEarnings: "INR 0.00",
      totalPayout: "INR 0.00",
      pendingPayout: "INR 0.00",
      topPlatform: "YouTube",
      musicCreated: 0,
      musicReleased: 0,
      videosCreated: 0,
      videosReleased: 0,
    }),
    []
  );

  const earningData = useMemo(
    () => [
      { name: "Jan", amount: 0 },
      { name: "Feb", amount: 0 },
      { name: "Mar", amount: 0 },
      { name: "Apr", amount: 0 },
      { name: "May", amount: 0 },
      { name: "Jun", amount: 0 },
    ],
    []
  );

  const news = useMemo(
    () => [
      {
        tag: "All audio files must be in WAV format",
        text:
          "Our tool has been updated. Going forward, all audio files must be provided in WAV format with 24-bit / 48kHz or 24-bit / 96kHz specifications.",
      },
      {
        tag: "Upload only original masters",
        text:
          "Please ensure you upload only original uncompressed master files (not compressed or converted versions). Kindly update your clients.",
      },
    ],
    []
  );

  const notifications = useMemo(
    () => [
      {
        title: "Official TAT is 48 hours",
        text:
          "Content may ingest faster in non-peak times. If upload doesn't occur within TAT, please notify UT team for escalation with DSP.",
      },
      {
        title: "Artist profile linking",
        text:
          "For Artist profile linking, only Facebook page link and Instagram profile ID are accepted.",
      },
    ],
    []
  );

  return (
    <div className="dash-page mt-0 mb-1">
      <div className="dash-page-head">
        <div>
          <div
            className="text-xs uppercase dash-nav-label mb-1 tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            Dashboard
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold">Welcome, {userName}</h1>
          <p className="mt-0 text-sm" style={{ color: "var(--muted)" }}>
            Track earnings, releases, and requests across your catalog.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/cms/create-release" className="dash-btn">
            + Create Release
          </Link>
        </div>
      </div>

      {/* TOP KPI ROW (like your screenshot) */}
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

  {/* Card 1 */}
  <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-pink-500 via-red-500 to-yellow-400 shadow-lg">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm opacity-90">Total Earnings</p>
        <h2 className="text-2xl font-bold">{summary.totalEarnings}</h2>
        <p className="text-xs opacity-80">Across all platforms</p>
      </div>
      <Wallet className="w-8 h-8 opacity-90" />
    </div>
  </div>

  {/* Card 2 */}
  <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-blue-500 via-cyan-400 to-emerald-400 shadow-lg">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm opacity-90">Total Payout</p>
        <h2 className="text-2xl font-bold">{summary.totalPayout}</h2>
        <p className="text-xs opacity-80">Successfully paid</p>
      </div>
      <Receipt className="w-8 h-8 opacity-90" />
    </div>
  </div>

  {/* Card 3 */}
  <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 shadow-lg">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm opacity-90">Pending Payout</p>
        <h2 className="text-2xl font-bold">{summary.pendingPayout}</h2>
        <p className="text-xs opacity-80">In review</p>
      </div>
      <Clock className="w-8 h-8 opacity-90" />
    </div>
  </div>

  {/* Card 4 */}
  <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-orange-500 via-amber-400 to-lime-400 shadow-lg">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm opacity-90">Top in 3 months</p>
        <h2 className="text-2xl font-bold">{summary.topPlatform}</h2>
        <p className="text-xs opacity-80">Best performing DSP</p>
      </div>
      <Trophy className="w-8 h-8 opacity-90" />
    </div>
  </div>

</div>


      {/* SECOND ROW COLORED STATS */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GradientCard
          variant="a"
          icon={Music2}
          title="Music Created"
          value={summary.musicCreated}
        />
        <GradientCard
          variant="b"
          icon={BadgeCheck}
          title="Music Released"
          value={summary.musicReleased}
        />
        <GradientCard
          variant="c"
          icon={Video}
          title="Videos Created"
          value={summary.videosCreated}
        />
        <GradientCard
          variant="d"
          icon={Award}
          title="Videos Released"
          value={summary.videosReleased}
        />
      </div>

      {/* MAIN GRID */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          {/* RELEASE DRAFTS TABLE */}
          <div className="dash-card p-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="text-lg font-semibold">Music Release Drafts</h2>
              <Link to="/cms/create-release" className="dash-btn-secondary">
                Create draft
              </Link>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Release Title</th>
                    <th>Created On</th>
                    <th>Progress</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={5} style={{ color: "var(--muted)" }}>
                      No Drafts Found.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* PERFORMANCE (kept, but cleaner) */}
          {/* <div className="dash-card p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold">Earnings trend</h2>
                <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                  Demo chart (connect your stores for real stats)
                </p>
              </div>
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <input type="date" className="dash-input w-full lg:w-[180px]" />
                <input type="date" className="dash-input w-full lg:w-[180px]" />
              </div>
            </div>

            <div className="mt-5 h-72 dash-card p-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={earningData}>
                  <defs>
                    <linearGradient id="earnFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--dash-accent)"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--dash-accent)"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.18)" />
                  <XAxis dataKey="name" stroke="rgba(148,163,184,.85)" />
                  <YAxis stroke="rgba(148,163,184,.85)" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="var(--dash-accent)"
                    strokeWidth={2}
                    fill="url(#earnFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div> */}

          {/* NEWS */}
          <div className="dash-card p-6">
            <h2 className="text-lg font-semibold">News</h2>
            <div className="mt-4 space-y-4">
              {news.map((n) => (
                <div key={n.tag} className="dash-card p-5">
                  <span className="dash-pill">{n.tag}</span>
                  <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
                    {n.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: NOTIFICATIONS */}
        <aside className="space-y-6">
          <div className="dash-card p-6">
            <h3 className="text-base font-semibold">Notifications</h3>
            <div className="mt-4 space-y-4">
              {notifications.map((n) => (
                <div key={n.title} className="dash-card p-5">
                  <div className="text-sm font-semibold">{n.title}</div>
                  <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                    {n.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="dash-card p-6">
            <h3 className="text-base font-semibold">Quick actions</h3>
            <div className="mt-4 grid gap-3">
              <Link to="/cms/create-release" className="dash-btn w-full text-center">
                Create Release
              </Link>
              <Link to="/cms/release-music" className="dash-btn-secondary w-full text-center">
                Release Music
              </Link>
              <Link to="/cms/sub-labels" className="dash-btn-secondary w-full text-center">
                Sub Labels
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
