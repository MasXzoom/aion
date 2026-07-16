"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("nexa_api_key");
    if (stored) {
      fetch("/api/me", { headers: { Authorization: `Bearer ${stored}` } })
        .then(r => r.ok && router.push("/dashboard"))
        .catch(() => {});
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: key.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Key tidak valid");
      localStorage.setItem("nexa_api_key", key.trim());
      router.push(data.role === "admin" ? "/admin" : "/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm mx-auto px-4">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-300 flex items-center justify-center text-sm font-bold text-background mx-auto mb-4">N</div>
          </Link>
          <h1 className="text-2xl font-bold">Masuk ke nexa<span className="text-teal-400">/api</span></h1>
          <p className="text-sm text-muted-foreground mt-2">Gunakan API key yang sudah dibeli</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">API Key</label>
              <input
                type="text"
                value={key}
                onChange={e => setKey(e.target.value)}
                placeholder="sk-nx-..."
                className="w-full bg-background border border-input rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                autoFocus
              />
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Memeriksa..." : "Masuk"}
            </button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Belum punya key?{" "}
            <Link href="/pricing" className="text-teal-400 hover:underline">
              Beli di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}