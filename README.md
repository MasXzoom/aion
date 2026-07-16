# Aion

AI Gateway — metered API keys to 20+ AI models. Satu endpoint, budget terkendali.

## Tech Stack
- Next.js 16 + React 19
- Tailwind CSS v4 (dark theme, teal/cyan)
- PM2 + Nginx (VPS)

## Routes
| Halaman | Path | Deskripsi |
|---|---|---|
| Landing | `/` | Hero, cara kerja, model catalog, pricing |
| Pricing | `/pricing` | 3 paket — Starter, Pro, Enterprise |
| Login | `/login` | Masuk pakai API key (`sk-nx-...`) |
| Dashboard | `/dashboard` | User: kuota, log aktivitas, model list, API docs |
| Admin | `/admin` | Kelola key, harga, model |

## API Endpoints
| Method | Path | Auth |
|---|---|---|
| `POST` | `/api/login` | Public |
| `GET` | `/api/me` | Bearer key |
| `GET` | `/api/me/logs` | Bearer key |
| `GET/POST/PUT/DELETE` | `/api/admin/keys` | Admin Bearer |

## Getting Started
```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # production server
```

## Deploy
```bash
tar -czf aion.tar.gz --exclude='node_modules' --exclude='.git' --exclude='.next' .
scp aion.tar.gz ubuntu@VPS:/home/ubuntu/
# on VPS: tar -xzf aion.tar.gz && npm install && npm run build && pm2 start npm --name aion -- start
```