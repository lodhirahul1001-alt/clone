import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { adminDeleteUserApi, adminGetUsersApi, adminUpdateUserRoleApi } from "../../apis/AdminApis";

export default function AdminUsers() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminGetUsersApi({ search: query, limit: 50 });
      setUsers(data?.users || []);
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.fullName, u.email, u.role].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [query, users]);

  const changeRole = async (id, role) => {
    try {
      await adminUpdateUserRoleApi(id, role);
      toast.success("Role updated");
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed to update role");
    }
  };

  const deleteUser = async (id) => {
    const ok = window.confirm("Delete this user? This cannot be undone.");
    if (!ok) return;
    try {
      await adminDeleteUserApi(id);
      toast.success("User deleted");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed to delete user");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Admin · Users</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Promote/demote users and manage accounts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name/email..."
            className="dash-input"
          />
          <button
            className="dash-btn"
            type="button"
            onClick={fetchUsers}
            disabled={loading}
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="dash-card p-3 rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ color: "var(--muted)" }}>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Role</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-2" colSpan={4}>
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td className="p-2" colSpan={4}>
                  No users found
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u._id} style={{ borderTop: "1px solid var(--dash-border)" }}>
                  <td className="p-2 whitespace-nowrap">{u.fullName || "-"}</td>
                  <td className="p-2 whitespace-nowrap">{u.email || "-"}</td>
                  <td className="p-2 whitespace-nowrap">
                    <span className="px-2 py-1 rounded-lg dash-badge">{u.role || "user"}</span>
                  </td>
                  <td className="p-2 whitespace-nowrap flex gap-2">
                    {u.role !== "admin" ? (
                      <button
                        className="dash-btn"
                        type="button"
                        onClick={() => changeRole(u._id, "admin")}
                      >
                        Make Admin
                      </button>
                    ) : (
                      <button
                        className="dash-btn"
                        type="button"
                        onClick={() => changeRole(u._id, "user")}
                      >
                        Remove Admin
                      </button>
                    )}
                    <button
                      className="dash-btn"
                      type="button"
                      onClick={() => deleteUser(u._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
