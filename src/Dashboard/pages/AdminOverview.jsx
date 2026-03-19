import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router";
import { adminGetStatsApi } from "../../apis/AdminApis";

const StatCard = ({ label, value, hint, to }) => {
  const inner = (
    <div className="dash-card p-4 rounded-2xl hover:opacity-95 transition">
      <div className="text-sm" style={{ color: "var(--muted)" }}>
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {hint ? (
        <div className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
          {hint}
        </div>
      ) : null}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block cursor-pointer">
        {inner}
      </Link>
    );
  }
  return inner;
};

export default function AdminOverview() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminGetStatsApi();
      setStats(data?.stats || null);
      setLastUpdated(new Date());
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed to load admin stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cards = useMemo(() => {
    const s = stats || {};
    return [
      {
        label: "Total Users",
        value: s.totalUsers ?? "-",
        to: "/cms/admin/users",
      },
      {
        label: "Total Tracks",
        value: s.totalTracks ?? "-",
        hint: `Pending: ${s.pendingTracks ?? "-"} · Active: ${s.activeTracks ?? "-"} · Rejected: ${s.rejectedTracks ?? "-"}`,
        to: "/cms/admin/tracks",
      },
      {
        label: "Claims",
        value: s.totalClaims ?? "-",
        hint: `Pending: ${s.pendingClaims ?? "-"}`,
        to: "/cms/admin/claims",
      },
      {
        label: "Payments",
        value: s.totalPayments ?? "-",
        hint: `Pending: ${s.pendingPayments ?? "-"}`,
        to: "/cms/admin/payments",
      },
      {
        label: "Callback Requests",
        value: s.totalCallbacks ?? "-",
        to: "/cms/admin/callbacks",
      },
    ];
  }, [stats]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Admin · Overview</h1>
          <p className="text-sm uppercase" style={{ color: "var(--muted)" }}>
            One place to monitor everything: users, uploads, payments, claims and callbacks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="dash-btn cursor-pointer" type="button" onClick={fetchStats} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      <div className="dash-card p-4 rounded-2xl">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="font-semibold">Quick Actions</div>
            <div className="text-sm" style={{ color: "var(--muted)" }}>
              Jump directly to the sections you manage most.
            </div>
          </div>
          {lastUpdated ? (
            <div className="text-xs" style={{ color: "var(--muted)" }}>
              Last updated: {lastUpdated.toLocaleString()}
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link className="dash-btn cursor-pointer" to="/cms/admin/tracks">Manage Tracks</Link>
          <Link className="dash-btn cursor-pointer" to="/cms/admin/payments">Verify Payments</Link>
          <Link className="dash-btn cursor-pointer" to="/cms/admin/claims">Review Claims</Link>
          <Link className="dash-btn cursor-pointer" to="/cms/admin/callbacks">Callback Requests</Link>
          <Link className="dash-btn cursor-pointer" to="/cms/admin/notification">Update Notice Bar</Link>
        </div>
      </div>
    </div>
  );
}
