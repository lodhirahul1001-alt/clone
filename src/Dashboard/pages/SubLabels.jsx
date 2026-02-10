import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Trash2, Pencil, Building2, X } from "lucide-react";
import toast from "react-hot-toast";
import { AxiosIntance } from "../../config/Axios.Intance";


const emptyForm = {
  name: "",
  email: "",
  phone: "",
  city: "",
  state: "",
  website: "",
};

export default function SubLabels() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((x) =>
      [x.name, x.email, x.phone, x.city, x.state, x.website]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [items, query]);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await AxiosIntance.get("/sublabels");
      setItems(Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to load sub labels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const onEdit = (row) => {
    setEditing(row);
    setForm({
      name: row?.name || "",
      email: row?.email || "",
      phone: row?.phone || "",
      city: row?.city || "",
      state: row?.state || "",
      website: row?.website || "",
    });
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const onChange = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (!form.name.trim()) return toast.error("Sub label name is required");

      if (editing?._id) {
        await AxiosIntance.put(`/sublabels/${editing._id}`, form);
        toast.success("Sub label updated");
      } else {
        await AxiosIntance.post("/sublabels", form);
        toast.success("Sub label created");
      }

      onClose();
      await load();
    } catch (e2) {
      toast.error(e2?.response?.data?.message || "Save failed");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this sub label?")) return;
    try {
      await AxiosIntance.delete(`/sublabels/${id}`);
      toast.success("Deleted");
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--text)] flex items-center gap-2">
            <Building2 className="w-6 ml-8 h-6 text-primary" />
            Sub Labels
          </h1>
          <p className="text-sm ml-8 text-[color:var(--muted)] mt-1">
            Create and manage sub-labels under your account.
          </p>
        </div>

        <button
          onClick={onCreate}
          className="inline-flex ml-8 items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-[color:var(--text)] shadow hover:opacity-95"
        >
          <Plus className="w-4 ml-8 h-4" />
          New Sub Label
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center ml-8 gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-800" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sub labels..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] text-[color:var(--text)]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border ml-8 border-[color:var(--border)] bg-[color:var(--panel)] backdrop-blur overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[color:var(--panel-soft)]">
              <tr className="text-left">
                <th className="px-4 py-3 font-semibold text-[color:var(--muted)]">Name</th>
                <th className="px-4 py-3 font-semibold text-[color:var(--muted)]">Email</th>
                <th className="px-4 py-3 font-semibold text-[color:var(--muted)]">Phone</th>
                <th className="px-4 py-3 font-semibold text-[color:var(--muted)]">City</th>
                <th className="px-4 py-3 font-semibold text-[color:var(--muted)]">State</th>
                <th className="px-4 py-3 font-semibold text-[color:var(--muted)] text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-[color:var(--muted)]" colSpan={6}>
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-[color:var(--muted)]" colSpan={6}>
                    No sub labels found.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row._id} className="border-t border-[color:var(--border)]">
                    <td className="px-4 py-3 text-[color:var(--text)] font-medium">{row.name}</td>
                    <td className="px-4 py-3 text-[color:var(--muted)]">{row.email || "—"}</td>
                    <td className="px-4 py-3 text-[color:var(--muted)]">{row.phone || "—"}</td>
                    <td className="px-4 py-3 text-[color:var(--muted)]">{row.city || "—"}</td>
                    <td className="px-4 py-3 text-[color:var(--muted)]">{row.state || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEdit(row)}
                          className="p-2 rounded-lg border border-[color:var(--border)] hover:bg-[color:var(--panel-soft)] text-[color:var(--text)]"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => remove(row._id)}
                          className="p-2 rounded-lg border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />

          <div className="relative w-full max-w-xl rounded-2xl border border-[color:var(++border)] bg-[color:var(++panel)] bg-black shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[color:var(--border)] flex items-center justify-between">
              <h2 className="font-semibold text-[color:var(--text)]">
                {editing?._id ? "Edit Sub Label" : "Create Sub Label"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-[color:var(--panel-soft)] text-[color:var(--muted)]"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={submit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-bla">
                <div>
                  <label className="text-xs text-[color:var(--muted)]">Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => onChange("name", e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--panel-soft)] text-[color:var(--text)]"
                    placeholder="Sub label name"
                  />
                </div>

                <div>
                  <label className="text-xs text-[color:var(--muted)]">Email</label>
                  <input
                    value={form.email}
                    onChange={(e) => onChange("email", e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--panel-soft)] text-[color:var(--text)]"
                    placeholder="email@domain.com"
                  />
                </div>

                <div>
                  <label className="text-xs text-[color:var(--muted)]">Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => onChange("phone", e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--panel-soft)] text-[color:var(--text)]"
                    placeholder="+91..."
                  />
                </div>

                <div>
                  <label className="text-xs text-[color:var(--muted)]">Website</label>
                  <input
                    value={form.website}
                    onChange={(e) => onChange("website", e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--panel-soft)] text-[color:var(--text)]"
                    placeholder="https://"
                  />
                </div>

                <div>
                  <label className="text-xs text-[color:var(--muted)]">City</label>
                  <input
                    value={form.city}
                    onChange={(e) => onChange("city", e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--panel-soft)] text-[color:var(--text)]"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="text-xs text-[color:var(--muted)]">State</label>
                  <input
                    value={form.state}
                    onChange={(e) => onChange("state", e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--panel-soft)] text-[color:var(--text)]"
                    placeholder="State"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-[color:var(--border)] text-[color:var(--text)] hover:bg-[color:var(--panel-soft)]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-[color:var(--text)] shadow hover:opacity-95"
                >
                  {editing?._id ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
