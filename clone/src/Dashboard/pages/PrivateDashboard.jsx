import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {Link} from "react-router"

export default function PrivateDashboard() {
  const [userName] = useState("User");

  const stats = {
    netRevenue: "$0",
    arr: "$0",
    newOrders: 0,
    releases: 0,
    artists: 0,
  };

  const earningData = [
    { name: "Jan", amount: 0 },
    { name: "Feb", amount: 0 },
    { name: "Mar", amount: 0 },
    { name: "Apr", amount: 0 },
    { name: "May", amount: 0 },
    { name: "Jun", amount: 0 },
  ];

  const platformSplit = [
    { name: "Spotify", pct: 42 },
    { name: "YouTube", pct: 28 },
    { name: "Apple Music", pct: 18 },
    { name: "Others", pct: 12 },
  ];

  const topMixes = [
    {
      title: "Main Jahan Rahoon",
      artist: "Yasser Desai",
      cover:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop",
    },
    {
      title: "Samastipur Jila Ke",
      artist: "Pyare Arjun, Sapna Raj",
      cover:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop",
    },
  ];

  const notifications = [
    { title: "New users registered", meta: "Today" },
    { title: "Orders processed", meta: "This week" },
    { title: "Payout requested", meta: "Pending" },
    { title: "Unresolved support tickets", meta: "2 open" },
  ];

  return (
<div className="dash-page mt-0 mb-1">
      <div className="dash-page-head">
        <div>
          <div className="text-xs uppercase dash-nav-label mb-1 tracking-widest" style={{ color: "var(--muted)" }}>
            Overview
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold">Welcome back, {userName}</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Track releases, royalties, and activity across your catalog.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/cms/create-release" className="dash-btn">
            + Upload New Track
          </Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* MAIN */}
        <div className="space-y-6">
          {/* KPI ROW */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="dash-card p-5">
              <div className="text-xs" style={{ color: "var(--muted)" }}>Net revenue</div>
              <div className="mt-2 text-2xl font-semibold">{stats.netRevenue}</div>
              <div className="mt-2 text-xs" style={{ color: "var(--muted)" }}>0% vs last month</div>
            </div>
            <div className="dash-card p-5">
              <div className="text-xs" style={{ color: "var(--muted)" }}>ARR</div>
              <div className="mt-2 text-2xl font-semibold">{stats.arr}</div>
              <div className="mt-2 text-xs" style={{ color: "var(--muted)" }}>—</div>
            </div>
            <div className="dash-card p-5">
              <div className="text-xs" style={{ color: "var(--muted)" }}>Releases</div>
              <div className="mt-2 text-2xl font-semibold">{stats.releases}</div>
              <div className="mt-2 text-xs" style={{ color: "var(--muted)" }}>Catalog items</div>
            </div>
            <div className="dash-card p-5">
              <div className="text-xs" style={{ color: "var(--muted)" }}>Artists</div>
              <div className="mt-2 text-2xl font-semibold">{stats.artists}</div>
              <div className="mt-2 text-xs" style={{ color: "var(--muted)" }}>Workspaces</div>
            </div>
          </div>

          {/* PERFORMANCE SNAPSHOT */}
          <div className="dash-card p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold">Performance snapshot</h2>
                <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                  Earnings pulse + platform split (demo)
                </p>
              </div>
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <input type="date" className="dash-input w-full lg:w-[180px]" />
                <input type="date" className="dash-input w-full lg:w-[180px]" />
              </div>
            </div>

            <div className="mt-6 grid lg:grid-cols-[1fr_260px] gap-6">
              <div className="h-72 dash-card p-4">
                <div className="text-sm font-semibold">Earnings pulse</div>
                <div className="mt-3 h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={earningData}>
                      <defs>
                        <linearGradient id="earnFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--dash-accent)" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="var(--dash-accent)" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.16)" />
                      <XAxis dataKey="name" stroke="rgba(148,163,184,.75)" />
                      <YAxis stroke="rgba(148,163,184,.75)" />
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
              </div>

              <div className="dash-card p-4">
                <div className="text-sm font-semibold">Platform split</div>
                <div className="mt-4 space-y-3">
                  {platformSplit.map((p) => (
                    <div key={p.name}>
                      <div className="flex items-center justify-between text-xs" style={{ color: "var(--muted)" }}>
                        <span>{p.name}</span>
                        <span>{p.pct}%</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,.06)" }}>
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${p.pct}%`, background: "linear-gradient(90deg,var(--accent-1),var(--accent-2))" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 text-xs" style={{ color: "var(--muted)" }}>
                  Tip: Connect stores to see real numbers here.
                </div>
              </div>
            </div>
          </div>

          {/* CUSTOMER / TOP MIXES */}
          <div className="dash-card p-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h2 className="text-lg font-semibold">Recent catalog highlights</h2>
              <a href="/cms/release-music" className="dash-btn-secondary">View all</a>
            </div>
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {topMixes.map((mix, index) => (
                <div key={index} className="dash-card p-0 overflow-hidden">
                  <img src={mix.cover} alt={mix.title} className="w-full aspect-square object-cover" />
                  <div className="p-3">
                    <div className="text-sm font-semibold truncate">{mix.title}</div>
                    <div className="text-xs truncate" style={{ color: "var(--muted)" }}>{mix.artist}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="space-y-6">
          <div className="dash-card p-6">
            <h3 className="text-base font-semibold">Notifications</h3>
            <div className="mt-4 space-y-3">
              {notifications.map((n) => (
                <div key={n.title} className="dash-card p-4">
                  <div className="text-sm font-semibold">{n.title}</div>
                  <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>{n.meta}</div>
                </div>
              ))}
            </div>
          </div>


          <div className="dash-card p-6">
            <h3 className="text-base font-semibold">Quick actions</h3>
            <div className="mt-4 grid gap-3">
              <Link to="/cms/create-release" className="dash-btn w-full text-center">
                Upload track
              </Link>
              <Link to={"/cms/user-profile" } className="dash-btn-secondary w-full text-center">
                Update profile
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
