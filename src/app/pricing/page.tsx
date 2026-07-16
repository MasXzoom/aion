import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-300 flex items-center justify-center text-sm font-bold text-background">N</div>
            <span className="font-bold text-lg">aion</span>
          </Link>
          <Link href="/login" className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition font-medium">Masuk</Link>
        </div>
      </nav>
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-center mb-4">Pilih <span className="gradient-text">paket</span> token</h1>
        <p className="text-muted-foreground text-center mb-16 max-w-md mx-auto">Key prabayar — budget tetap, masa berlaku jelas. Saat habis, akses berhenti otomatis.</p>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { name: "Starter", price: "25.000", quota: "25M", models: "Semua model", days: "30", color: "from-teal-400/20 to-cyan-300/20" },
            { name: "Pro", price: "100.000", quota: "100M", models: "Semua model", days: "60", pop: true, color: "from-teal-400/30 to-cyan-300/30" },
            { name: "Enterprise", price: "500.000", quota: "500M", models: "Semua model", days: "90", color: "from-teal-400/20 to-cyan-300/20" },
          ].map((p, i) => (
            <div key={i} className={`rounded-xl border ${p.pop ? 'border-teal-400' : 'border-border'} bg-card relative overflow-hidden`}>
              {p.pop && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-400 text-background text-xs font-bold px-3 py-1 rounded-full z-10">POPULER</div>}
              <div className={`absolute inset-0 bg-gradient-to-b ${p.color} opacity-50`} />
              <div className="relative p-6">
                <h3 className="font-bold text-xl mb-1">{p.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">Key akses ke semua model</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">Rp{p.price}</span>
                  <span className="text-muted-foreground text-sm">/key</span>
                </div>
                <ul className="space-y-3 text-sm mb-8">
                  <li className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-teal-400/20 flex items-center justify-center text-teal-400 text-xs">✓</div> {p.quota} token budget</li>
                  <li className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-teal-400/20 flex items-center justify-center text-teal-400 text-xs">✓</div> {p.models}</li>
                  <li className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-teal-400/20 flex items-center justify-center text-teal-400 text-xs">✓</div> Berlaku {p.days} hari</li>
                  <li className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-teal-400/20 flex items-center justify-center text-teal-400 text-xs">✓</div> Akses real-time usage</li>
                </ul>
                <Link href={p.pop ? "/checkout?plan=pro" : `/checkout?plan=${p.name.toLowerCase()}`} className="block w-full text-center py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition glow">
                  Beli Key →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}