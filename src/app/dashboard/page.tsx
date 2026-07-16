import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-300 flex items-center justify-center text-sm font-bold text-background">N</div>
            <span className="font-bold text-lg">nexa<span className="text-teal-400">/api</span></span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">user@email.com</span>
            <Link href="/login" className="text-muted-foreground hover:text-foreground">Keluar</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Key", value: "3" },
            { label: "Total Usage", value: "1.2M" },
            { label: "Sisa Budget", value: "23.8M" },
            { label: "Model Tersedia", value: "22" },
          ].map((s, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        {/* API Keys */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">API Keys</h2>
            <button className="bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition">+ Key Baru</button>
          </div>
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="text-left pb-3 font-medium">Nama</th>
                  <th className="text-left pb-3 font-medium">Key</th>
                  <th className="text-left pb-3 font-medium">Status</th>
                  <th className="text-left pb-3 font-medium">Budget</th>
                  <th className="text-left pb-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Production", key: "sk-nx-••••a1b2", status: "Aktif", budget: "15M / 25M" },
                  { name: "Development", key: "sk-nx-••••c3d4", status: "Aktif", budget: "8M / 10M" },
                  { name: "Testing", key: "sk-nx-••••e5f6", status: "Habis", budget: "0 / 5M" },
                ].map((k, i) => (
                  <tr key={i} className="border-t border-border/50">
                    <td className="py-3">{k.name}</td>
                    <td className="py-3 font-mono text-xs">{k.key}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${k.status === 'Aktif' ? 'bg-teal-400/10 text-teal-400' : 'bg-red-400/10 text-red-400'}`}>{k.status}</span>
                    </td>
                    <td className="py-3 text-xs">{k.budget}</td>
                    <td className="py-3">
                      <button className="text-teal-400 hover:underline text-xs">Salin</button>
                      <span className="mx-2 text-border">|</span>
                      <button className="text-red-400 hover:underline text-xs">Cabut</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Usage Chart */}
        <div className="mt-6 bg-card border border-border rounded-xl p-6">
          <h2 className="font-semibold mb-4">Pemakaian 7 Hari Terakhir</h2>
          <div className="flex items-end gap-2 h-32">
            {[40, 65, 35, 80, 55, 90, 70].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-teal-400/20 rounded-t" style={{ height: `${h}%` }} />
                <span className="text-xs text-muted-foreground">{['Sen','Sel','Rab','Kam','Jum','Sab','Min'][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}