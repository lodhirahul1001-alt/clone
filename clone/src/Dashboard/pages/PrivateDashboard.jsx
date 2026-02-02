import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router";

export default function PrivateDashboard() {
  const [darkMode, setDarkMode] = useState(false);

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

  const notifications = [
    { title: "🎵 New release approved", meta: "Just now" },
    { title: "💰 Payout requested", meta: "Today" },
    { title: "🎉 Holiday: Office closed", meta: "26 Jan" },
    { title: "📈 Streams increased", meta: "This week" },
  ];

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-[#f6f7fb] dark:bg-[#0b0b14] p-6 transition-colors">

        {/* 🔔 STICKY NOTIFICATION BAR */}
        <div className="sticky top-4 z-40 mb-6">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
            <div className="flex gap-10 px-6 py-3 animate-notify">
              {notifications.slice(0, 3).map((n, i) => (
                <div key={i} className="flex items-center gap-3 whitespace-nowrap">
                  <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                  <span className="text-sm font-medium">{n.title}</span>
                  <span className="text-xs opacity-80">• {n.meta}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-xs uppercase text-gray-500">Dashboard</p>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Welcome back
            </h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-2 rounded-md text-sm
              bg-gray-200 dark:bg-white/10
              text-gray-900 dark:text-gray-200"
            >
              {darkMode ? "" : ""}
            </button>

            <Link
              to="/cms/create-release"
              className="px-4 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
            >
              + Upload Track
            </Link>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-[1fr_360px] gap-6">

          {/* LEFT */}
          <div className="space-y-6">
            

            {/* EARNINGS */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-purple-600/10 to-indigo-600/10 border border-white/10">
              <div className="flex justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Earnings Pulse
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Last 6 months
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-purple-600/10 text-purple-600 dark:text-purple-400">
                  Live
                </span>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={earningData}>
                    <defs>
                      <linearGradient id="earnUnique" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis hide />
                    <Tooltip />
                    <Area
                      dataKey="amount"
                      stroke="#7c3aed"
                      strokeWidth={3}
                      fill="url(#earnUnique)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* PLATFORM SPLIT */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-gray-200 dark:border-white/10">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-5">
                Revenue by Platform
              </h2>

              {platformSplit.map((p) => (
                <div key={p.name} className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>{p.name}</span>
                    <span>{p.pct}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-200 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600"
                      style={{ width: `${p.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <aside className="space-y-6">

            

            {/* ACTIVITY */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-gray-200 dark:border-white/10">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-5">
                Recent Activity
              </h3>

              {notifications.map((n, i) => (
                <div key={i} className="flex gap-3 mb-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {n.meta}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            

            {/* QUICK ACTIONS */}
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/cms/create-release"
                className="rounded-xl p-4 text-center bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-medium"
              >
                ⬆ Upload
              </Link>

              <Link
                to="/cms/user-profile"
                className="rounded-xl p-4 text-center bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-medium"
              >
                ⚙ Profile
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
