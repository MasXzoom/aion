"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AdminKey {
  name: string;
  key: string;
  _full: string;
  status: string;
  remain_quota: number;
  total_quota: number;
  unlimited_quota: boolean;
  expired_time: number;
  created_at: string;
  role: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [keys, setKeys] = useState<AdminKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newKey, setNewKey] = useState<{ name: string; quota: number; days: number }>({ name: "", quota: 25000000, days: 30 });
  const [newKeyResult, setNewKeyResult] = useState<string | null>(null);
  const [editKey, setEditKey] = useState<AdminKey | null>(null);
  const [activeTab, setActiveTab] = useState<"keys" | "pricing" | "models">("keys");
  const [pricing, setPricing] = useState([
    { name: "Starter", price: 25000, quota: 25000000, days: 30 },
    { name: "Pro", price: 100000, quota: 100000000, days: 60 },
    { name: "Enterprise", price: 500000, quota: 500000000, days: 90 },
  ]);

  const apiKey = typeof window !== "undefined" ? localStorage.getItem("nexa_api_key") : null;

  const fetchKeys = useCallback(async () => {
    if (!apiKey) { router.push("/login"); return; }
    try {
      const res = await fetch("/api/admin/keys", { headers: { Authorization: `Bearer ${apiKey}` } });
      if (!res.ok) { router.push("/dashboard"); return; }
      const data = await res.json();
      setKeys(data.keys || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [apiKey, router]);

  useEffect(() => { fetchKeys(); }, [fetchKeys]);

  const createNewKey = async () => {
    if (!apiKey) return;
    const res = await fetch("/api/admin/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ name: newKey.name || "User Key", quota: newKey.quota, expired_time: Math.floor(Date.now() / 1000) + newKey.days * 86400 }),
    });
    if (res.ok) {
      const data = await res.json();
      setNewKeyResult(data.key);
      setShowNew(false);
      setNewKey({ name: "", quota: 25000000, days: 30 });
      fetchKeys();
    }
  };

  const deleteKey = async (fullKey: string) => {
    if (!apiKey || !confirm("Hapus key ini?")) return;
    await fetch(`/api/admin/keys/${fullKey}`, { method: "DELETE", headers: { Authorization: `Bearer ${apiKey}` } });
    fetchKeys();
  };

  const updateKeyStatus = async (fullKey: string, status: string) => {
    if (!apiKey) return;
    await fetch(`/api/admin/keys/${fullKey}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ status }),
    });
    fetchKeys();
  };

  const updateKeyQuota = async (fullKey: string, remain_quota: number, unlimited_quota: boolean) => {
    if (!apiKey) return;
    await fetch(`/api/admin/keys/${fullKey}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ remain_quota, unlimited_quota }),
    });
    setEditKey(null);
    fetchKeys();
  };

  const logout = () => { localStorage.removeItem("nexa_api_key"); router.push("/login"); };

  const formatQuota = (n: number) => n >= 1e9 ? `${(n/1e9).toFixed(1)}B` : n >= 1e6 ? `${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `${(n/1e3).toFixed(1)}K` : String(n);
  const formatRupiah = (n: number) => `Rp${n.toLocaleString("id-ID")}`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-300 flex items-center justify-center text-sm font-bold text-background">N</div>
            <span className="font-bold text-lg">nexa<span className="text-teal-400">/api</span> <span className="text-xs bg-teal-400/20 text-teal-400 px-2 py-0.5 rounded ml-1">Admin</span></span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">User View</Link>
            <button onClick={logout} className="text-muted-foreground hover:text-foreground">Keluar</button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-1 bg-card border border-border rounded-xl p-1 mb-8 w-fit">
          {[
            { key: "keys", label: "API Keys" },
            { key: "pricing", label: "Harga & Paket" },
            { key: "models", label: "Model List" },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Keys Management */}
        {activeTab === "keys" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Kelola API Keys</h2>
                <p className="text-sm text-muted-foreground mt-1">{keys.length} key terdaftar</p>
              </div>
              <button onClick={() => { setShowNew(true); setNewKeyResult(null); }} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition">
                + Key Baru
              </button>
            </div>

            {showNew && (
              <div className="bg-card border border-teal-400/50 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold">Buat Key Baru</h3>
                {newKeyResult ? (
                  <div className="space-y-3">
                    <div className="bg-teal-400/10 border border-teal-400/30 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Key baru (simpan sekarang — hanya ditampilkan sekali):</p>
                      <code className="text-sm text-teal-400 font-mono break-all">{newKeyResult}</code>
                    </div>
                    <button onClick={() => { setShowNew(false); setNewKeyResult(null); }} className="text-sm text-muted-foreground hover:text-foreground">Tutup</button>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Nama Key</label>
                      <input value={newKey.name} onChange={e => setNewKey({ ...newKey, name: e.target.value })} placeholder="contoh: Customer A" className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/50" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Kuota Token</label>
                        <select value={newKey.quota} onChange={e => setNewKey({ ...newKey, quota: Number(e.target.value) })} className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/50">
                          <option value={5000000}>5M</option>
                          <option value={25000000}>25M</option>
                          <option value={50000000}>50M</option>
                          <option value={100000000}>100M</option>
                          <option value={500000000}>500M</option>
                          <option value={999999999}>Unlimited</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Masa Berlaku</label>
                        <select value={newKey.days} onChange={e => setNewKey({ ...newKey, days: Number(e.target.value) })} className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/50">
                          <option value={7}>7 hari</option>
                          <option value={30}>30 hari</option>
                          <option value={60}>60 hari</option>
                          <option value={90}>90 hari</option>
                          <option value={365}>1 tahun</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={createNewKey} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition">Buat Key</button>
                      <button onClick={() => setShowNew(false)} className="border border-border px-4 py-2 rounded-lg text-sm hover:bg-secondary transition">Batal</button>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-muted-foreground text-xs uppercase tracking-wider">
                      <th className="text-left px-4 py-3 font-medium">Nama</th>
                      <th className="text-left px-4 py-3 font-medium">Key</th>
                      <th className="text-left px-4 py-3 font-medium">Status</th>
                      <th className="text-left px-4 py-3 font-medium">Kuota</th>
                      <th className="text-left px-4 py-3 font-medium">Expired</th>
                      <th className="text-left px-4 py-3 font-medium">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keys.map((k, i) => (
                      <tr key={i} className="border-t border-border/50">
                        <td className="px-4 py-3">
                          <span className="font-medium">{k.name}</span>
                          {k.role === "admin" && <span className="ml-1 text-xs bg-teal-400/20 text-teal-400 px-1.5 py-0.5 rounded">admin</span>}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">{k.key}</td>
                        <td className="px-4 py-3">
                          <select
                            value={k.status}
                            onChange={e => updateKeyStatus(k._full, e.target.value)}
                            className={`text-xs px-2 py-1 rounded border ${k.status === "active" ? "border-teal-400/30 bg-teal-400/10 text-teal-400" : "border-red-400/30 bg-red-400/10 text-red-400"}`}
                          >
                            <option value="active">Aktif</option>
                            <option value="disabled">Nonaktif</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          {editKey?._full === k._full ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={editKey.remain_quota}
                                onChange={e => setEditKey({ ...editKey, remain_quota: Number(e.target.value) })}
                                className="w-20 bg-background border border-input rounded px-2 py-1 text-xs"
                              />
                              <button onClick={() => updateKeyQuota(k._full, editKey.remain_quota, editKey.unlimited_quota)} className="text-teal-400 text-xs">✓</button>
                              <button onClick={() => setEditKey(null)} className="text-red-400 text-xs">✗</button>
                            </div>
                          ) : (
                            <span onClick={() => setEditKey({ ...k })} className="cursor-pointer hover:text-teal-400 text-xs font-mono">
                              {k.unlimited_quota ? "Unlimited" : `${formatQuota(k.remain_quota)} / ${formatQuota(k.total_quota)}`}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {k.expired_time === -1 ? "—" : new Date(k.expired_time * 1000).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => deleteKey(k._full)} className="text-red-400 hover:underline text-xs">Hapus</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Management */}
        {activeTab === "pricing" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Atur Harga & Paket</h2>
              <p className="text-sm text-muted-foreground mt-1">Edit harga yang tampil di halaman /pricing</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {pricing.map((p, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Nama Paket</label>
                    <input
                      value={p.name}
                      onChange={e => {
                        const next = [...pricing];
                        next[i].name = e.target.value;
                        setPricing(next);
                      }}
                      className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Harga (Rp)</label>
                    <input
                      type="number"
                      value={p.price}
                      onChange={e => {
                        const next = [...pricing];
                        next[i].price = Number(e.target.value);
                        setPricing(next);
                      }}
                      className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Kuota Token</label>
                    <select
                      value={p.quota}
                      onChange={e => {
                        const next = [...pricing];
                        next[i].quota = Number(e.target.value);
                        setPricing(next);
                      }}
                      className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                    >
                      <option value={5000000}>5M</option>
                      <option value={25000000}>25M</option>
                      <option value={50000000}>50M</option>
                      <option value={100000000}>100M</option>
                      <option value={500000000}>500M</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Masa Berlaku (hari)</label>
                    <input
                      type="number"
                      value={p.days}
                      onChange={e => {
                        const next = [...pricing];
                        next[i].days = Number(e.target.value);
                        setPricing(next);
                      }}
                      className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Preview: <strong>{formatRupiah(p.price)}</strong> — {formatQuota(p.quota)} token — {p.days} hari
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => alert("Pricing saved (in-memory)")} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition">
              Simpan Harga
            </button>
          </div>
        )}

        {/* Models Management */}
        {activeTab === "models" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Model List</h2>
              <p className="text-sm text-muted-foreground mt-1">Model yang tersedia untuk semua user</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                "deepseek-v4-flash", "deepseek-v4-pro", "glm-5.2", "kimi-k2.6",
                "kimi-k2.7-code", "mimo-v2.5-pro", "qwen3.7-max", "gpt-oss-120b",
                "big-pickle", "hy3", "gemini-3.5", "gemini-3-flash",
              ].map(m => (
                <div key={m} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                  <code className="text-xs font-mono text-teal-400">nexa/{m}</code>
                  <span className="w-2 h-2 rounded-full bg-teal-400" />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Model list disinkronkan dengan gateway backend. Edit di server.py untuk menambah/menghapus model.</p>
          </div>
        )}
      </div>
    </div>
  );
}