"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface KeyInfo {
  name: string;
  role: string;
  key: string;
  status: string;
  remain_quota: number;
  total_quota: number;
  unlimited_quota: boolean;
  expired_time: number;
  created_at: string;
  last_used: string | null;
}

interface UsageLog {
  timestamp: string;
  model: string;
  tokens: number;
  endpoint: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [info, setInfo] = useState<KeyInfo | null>(null);
  const [logs, setLogs] = useState<UsageLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "logs" | "models" | "docs">("overview");

  const apiKey = typeof window !== "undefined" ? localStorage.getItem("nexa_api_key") : null;

  const fetchData = useCallback(async () => {
    if (!apiKey) { router.push("/login"); return; }
    try {
      const [meRes, logsRes] = await Promise.all([
        fetch("/api/me", { headers: { Authorization: `Bearer ${apiKey}` } }),
        fetch("/api/me/logs", { headers: { Authorization: `Bearer ${apiKey}` } }),
      ]);
      if (!meRes.ok) { localStorage.removeItem("nexa_api_key"); router.push("/login"); return; }
      setInfo(await meRes.json());
      if (logsRes.ok) setLogs((await logsRes.json()).logs || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [apiKey, router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const logout = () => { localStorage.removeItem("nexa_api_key"); router.push("/login"); };

  const formatQuota = (n: number) => n >= 1e9 ? `${(n/1e9).toFixed(1)}B` : n >= 1e6 ? `${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `${(n/1e3).toFixed(1)}K` : String(n);

  const models = [
    { id: "deepseek-v4-flash", name: "DeepSeek V4 Flash", ctx: "128K" },
    { id: "deepseek-v4-pro", name: "DeepSeek V4 Pro", ctx: "128K" },
    { id: "glm-5.2", name: "GLM 5.2", ctx: "128K" },
    { id: "kimi-k2.6", name: "Kimi K2.6", ctx: "128K" },
    { id: "kimi-k2.7-code", name: "Kimi K2.7 Code", ctx: "128K" },
    { id: "mimo-v2.5-pro", name: "MiMo v2.5 Pro", ctx: "32K" },
    { id: "qwen3.7-max", name: "Qwen 3.7 Max", ctx: "32K" },
    { id: "gpt-oss-120b", name: "GPT-OSS 120B", ctx: "128K" },
    { id: "big-pickle", name: "Big Pickle", ctx: "32K" },
    { id: "hy3", name: "Hy3", ctx: "32K" },
    { id: "gemini-3.5", name: "Gemini 3.5", ctx: "1M" },
    { id: "gemini-3-flash", name: "Gemini 3 Flash", ctx: "1M" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const quotaPct = info && !info.unlimited_quota && info.total_quota > 0
    ? Math.max(0, Math.min(100, (info.remain_quota / info.total_quota) * 100))
    : 100;

  return (
    <div className="min-h-screen">
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-300 flex items-center justify-center text-sm font-bold text-background">N</div>
            <span className="font-bold text-lg">nexa<span className="text-teal-400">/api</span></span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">{info?.name || "User"}</span>
            <button onClick={logout} className="text-muted-foreground hover:text-foreground transition">Keluar</button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-card border border-border rounded-xl p-1 mb-8 w-fit">
          {[
            { key: "overview", label: "Ringkasan" },
            { key: "logs", label: "Log Aktivitas" },
            { key: "models", label: "Model List" },
            { key: "docs", label: "API Docs" },
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

        {/* Overview */}
        {activeTab === "overview" && info && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Sisa Kuota", value: info.unlimited_quota ? "Unlimited" : formatQuota(info.remain_quota) },
                { label: "Total Kuota", value: info.unlimited_quota ? "Unlimited" : formatQuota(info.total_quota) },
                { label: "Status", value: info.status === "active" ? "Aktif" : "Nonaktif" },
                { label: "Berlaku Hingga", value: info.expired_time === -1 ? "Selamanya" : new Date(info.expired_time * 1000).toLocaleDateString("id-ID") },
              ].map((s, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                  <p className="text-2xl font-bold">{s.value}</p>
                </div>
              ))}
            </div>
            {!info.unlimited_quota && info.total_quota > 0 && (
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Pemakaian</span>
                  <span className="font-mono text-xs">{formatQuota(info.total_quota - info.remain_quota)} / {formatQuota(info.total_quota)}</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-400 to-cyan-300 rounded-full transition-all" style={{ width: `${100 - quotaPct}%` }} />
                </div>
              </div>
            )}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-semibold mb-2 text-sm">API Key Kamu</h3>
              <div className="flex items-center gap-2">
                <code className="bg-secondary px-3 py-2 rounded-lg text-xs font-mono flex-1 break-all">{info.key}</code>
                <button
                  onClick={() => { navigator.clipboard.writeText(info.key); }}
                  className="text-xs text-teal-400 hover:underline shrink-0"
                >Salin</button>
              </div>
            </div>
          </div>
        )}

        {/* Logs */}
        {activeTab === "logs" && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold">Log Aktivitas API</h2>
            </div>
            {logs.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">Belum ada aktivitas.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-muted-foreground text-xs uppercase tracking-wider">
                      <th className="text-left px-4 py-3 font-medium">Waktu</th>
                      <th className="text-left px-4 py-3 font-medium">Model</th>
                      <th className="text-left px-4 py-3 font-medium">Token</th>
                      <th className="text-left px-4 py-3 font-medium">Endpoint</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((l, i) => (
                      <tr key={i} className="border-t border-border/50">
                        <td className="px-4 py-3 text-xs font-mono">{new Date(l.timestamp).toLocaleString("id-ID")}</td>
                        <td className="px-4 py-3 text-xs">{l.model}</td>
                        <td className="px-4 py-3 text-xs font-mono">{l.tokens.toLocaleString()}</td>
                        <td className="px-4 py-3 text-xs font-mono">{l.endpoint}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Models */}
        {activeTab === "models" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Model Tersedia</h2>
              <span className="text-xs text-muted-foreground">{models.length} model</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {models.map(m => (
                <div key={m.id} className="bg-card border border-border rounded-xl p-4 hover:border-teal-400/30 transition">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm">{m.name}</h3>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">{m.ctx}</span>
                  </div>
                  <code className="text-xs text-teal-400 font-mono">nexa/{m.id}</code>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* API Docs */}
        {activeTab === "docs" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-semibold mb-2">Base URL</h2>
              <div className="bg-card border border-border rounded-xl p-4">
                <code className="text-sm text-teal-400 font-mono">https://api.nexa.my.id/v1</code>
              </div>
            </div>
            <div>
              <h2 className="font-semibold mb-2">Authentication</h2>
              <div className="bg-card border border-border rounded-xl p-4 space-y-2">
                <p className="text-sm text-muted-foreground">Gunakan API key kamu di header:</p>
                <pre className="bg-secondary rounded-lg p-3 text-xs font-mono overflow-x-auto">
{`Authorization: Bearer sk-nx-...`}
                </pre>
              </div>
            </div>
            <div>
              <h2 className="font-semibold mb-2">Chat Completion</h2>
              <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                <p className="text-sm text-muted-foreground">OpenAI-compatible endpoint:</p>
                <pre className="bg-secondary rounded-lg p-3 text-xs font-mono overflow-x-auto">
{`POST /v1/chat/completions
Content-Type: application/json

{
  "model": "nexa/deepseek-v4-flash",
  "messages": [
    {"role": "user", "content": "Halo!"}
  ],
  "max_tokens": 1000
}`}
                </pre>
              </div>
            </div>
            <div>
              <h2 className="font-semibold mb-2">cURL Example</h2>
              <div className="bg-card border border-border rounded-xl p-4">
                <pre className="bg-secondary rounded-lg p-3 text-xs font-mono overflow-x-auto">
{`curl https://api.nexa.my.id/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk-nx-YOUR_KEY" \\
  -d '{"model":"nexa/deepseek-v4-flash","messages":[{"role":"user","content":"Halo!"}]}'`}
                </pre>
              </div>
            </div>
            <div>
              <h2 className="font-semibold mb-2">Python Example</h2>
              <div className="bg-card border border-border rounded-xl p-4">
                <pre className="bg-secondary rounded-lg p-3 text-xs font-mono overflow-x-auto">
{`from openai import OpenAI

client = OpenAI(
    base_url="https://api.nexa.my.id/v1",
    api_key="sk-nx-YOUR_KEY"
)

response = client.chat.completions.create(
    model="nexa/deepseek-v4-flash",
    messages=[{"role": "user", "content": "Halo!"}]
)
print(response.choices[0].message.content)`}
                </pre>
              </div>
            </div>
            <div>
              <h2 className="font-semibold mb-2">Model List</h2>
              <p className="text-sm text-muted-foreground mb-2">Gunakan prefix <code className="text-teal-400 text-xs">nexa/</code> di depan model ID:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {models.map(m => (
                  <code key={m.id} className="bg-card border border-border rounded-lg px-3 py-2 text-xs font-mono text-muted-foreground">
                    <span className="text-teal-400">nexa/</span>{m.id}
                  </code>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}