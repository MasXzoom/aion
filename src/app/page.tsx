import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-300 flex items-center justify-center text-sm font-bold text-background">N</div>
            <span className="font-bold text-lg">aion</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition">Masuk</Link>
            <Link href="/pricing" className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition font-medium">Beli Key</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-xs text-muted-foreground mb-8">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" /> 
          Semua model dalam satu endpoint
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          API key <span className="gradient-text">bermeter</span><br />
          ke semua model AI
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
          Satu endpoint, budget dalam kendali penuh. 
          Tanpa instalasi, tanpa deposit minimum. QRIS, key instan.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/pricing" className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-medium hover:opacity-90 transition glow">
            Beli Key →
          </Link>
          <Link href="/docs" className="border border-border px-8 py-3 rounded-xl font-medium hover:bg-secondary transition">
            Dokumentasi
          </Link>
        </div>
        {/* Code block */}
        <div className="mt-12 max-w-xl mx-auto bg-card border border-border rounded-xl p-4 text-left">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <span className="text-teal-400">➜</span> 
            <span className="font-mono">~ curl https://api.aion.my.id/v1</span>
          </div>
          <pre className="text-sm font-mono text-muted-foreground">
            <span className="text-teal-400">#</span> Ganti base URL, langsung jalan.
          </pre>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-2xl font-bold text-center mb-16">Token pertama dalam <span className="gradient-text">hitungan menit</span></h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { num: "01", title: "Beli key", desc: "Pilih paket, bayar QRIS. Key diterbitkan otomatis dan hanya ditampilkan satu kali." },
            { num: "02", title: "Arahkan client ke /v1", desc: "Ganti base URL ke api.aion.my.id/v1 di SDK OpenAI mana pun. Kode tetap jalan." },
            { num: "03", title: "Terukur & terkendali", desc: "Setiap panggilan otomatis mengurangi budget. Saat habis, akses berhenti." },
          ].map((s, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 relative">
              <span className="text-4xl font-bold text-teal-400/20 absolute top-4 right-4">{s.num}</span>
              <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Models */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-2xl font-bold text-center mb-4">Satu key menjangkau <span className="gradient-text">semuanya</span></h2>
        <p className="text-muted-foreground text-center mb-12">DeepSeek, GLM, Claude, Gemini, Qwen, MiMo, Kimi — 20+ model</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            "deepseek-v4-flash", "deepseek-v4-pro", "glm-5.2", "claude-sonnet-4.5",
            "claude-opus-4.8", "gemini-3.5", "gemini-3-Flash", "qwen3.7-max",
            "kimi-k2.6", "kimi-k2.7-code", "mimo-v2.5-pro", "minimax-m3",
          ].map((m, i) => (
            <div key={i} className="bg-card border border-border rounded-lg px-4 py-3 text-sm font-mono text-muted-foreground hover:border-teal-400/30 transition">
              <span className="text-teal-400">aion/</span>{m}
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-2xl font-bold text-center mb-4">Pilih <span className="gradient-text">paket</span>mu</h2>
        <p className="text-muted-foreground text-center mb-12">Key prabayar. Tanpa tagihan mengejutkan.</p>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { name: "Starter", price: "25K", quota: "25M token", models: "Semua model", valid: "30 hari" },
            { name: "Pro", price: "100K", quota: "100M token", models: "Semua model", valid: "60 hari", pop: true },
            { name: "Enterprise", price: "500K", quota: "500M token", models: "Semua model", valid: "90 hari" },
          ].map((p, i) => (
            <div key={i} className={`rounded-xl border p-6 relative ${p.pop ? 'border-teal-400 bg-card glow' : 'border-border bg-card'}`}>
              {p.pop && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-400 text-background text-xs font-bold px-3 py-1 rounded-full">POPULER</div>}
              <h3 className="font-bold text-lg mb-1">{p.name}</h3>
              <div className="text-3xl font-bold mb-4">Rp{p.price}<span className="text-sm font-normal text-muted-foreground">/key</span></div>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li className="flex items-center gap-2">✓ {p.quota}</li>
                <li className="flex items-center gap-2">✓ {p.models}</li>
                <li className="flex items-center gap-2">✓ Berlaku {p.valid}</li>
              </ul>
              <Link href="/pricing" className="block text-center w-full py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition">Beli</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>aion — © 2026</p>
      </footer>
    </div>
  );
}