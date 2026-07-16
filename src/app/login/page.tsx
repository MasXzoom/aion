export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-300 flex items-center justify-center text-sm font-bold text-background mx-auto mb-4">N</div>
          <h1 className="text-2xl font-bold">Masuk ke nexa<span className="text-teal-400">/api</span></h1>
          <p className="text-sm text-muted-foreground mt-2">Kelola key dan pantau pemakaian</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <input type="email" placeholder="nama@email.com" className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/50" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Password</label>
              <input type="password" placeholder="••••••••" className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/50" />
            </div>
            <button className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:opacity-90 transition">Masuk</button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Belum punya akun? <a href="/register" className="text-teal-400 hover:underline">Daftar</a>
          </p>
        </div>
      </div>
    </div>
  );
}