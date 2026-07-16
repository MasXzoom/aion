import { NextRequest, NextResponse } from "next/server";
import { getKeyInfo, getAllKeys, createKey, updateKey, deleteKey, getUsageLogs } from "@/lib/api";

function requireAdmin(req: NextRequest) {
  const auth = req.headers.get("authorization")?.replace("Bearer ", "");
  const info = auth ? getKeyInfo(auth) : null;
  return info?.role === "admin";
}

// GET /api/admin/keys — list all keys
export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const url = new URL(req.url);
  const path = url.pathname.split("/").pop();

  // GET /api/admin/keys/:key/usage
  if (path && path !== "keys") {
    const key = decodeURIComponent(path);
    const logs = getUsageLogs(key);
    return NextResponse.json({ key, logs });
  }

  const keys = getAllKeys().map(({ key, ...rest }) => ({
    ...rest,
    key: key.slice(0, 12) + "..." + key.slice(-4),
    _full: key,
  }));
  return NextResponse.json({ keys });
}

// POST /api/admin/keys — create new key
export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const body = await req.json();
  const key = "sk-nx-" + Array.from({ length: 32 }, () => "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]).join("");
  const info = createKey({
    key,
    name: body.name || "User Key",
    status: "active",
    remain_quota: body.quota || 25000000,
    total_quota: body.quota || 25000000,
    unlimited_quota: body.unlimited_quota || false,
    expired_time: body.expired_time || (Date.now() / 1000 + 30 * 86400),
    created_at: new Date().toISOString(),
    last_used: null,
    role: "user",
  });

  return NextResponse.json({ key: key, name: info.name, quota: info.total_quota }, { status: 201 });
}

// PUT /api/admin/keys/:key — update key
export async function PUT(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const url = new URL(req.url);
  const targetKey = decodeURIComponent(url.pathname.split("/").pop() || "");
  const body = await req.json();
  const updated = updateKey(targetKey, body);
  if (!updated) return NextResponse.json({ error: "Key not found" }, { status: 404 });

  return NextResponse.json({ success: true });
}

// DELETE /api/admin/keys/:key — delete key
export async function DELETE(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const url = new URL(req.url);
  const targetKey = decodeURIComponent(url.pathname.split("/").pop() || "");
  const ok = deleteKey(targetKey);
  if (!ok) return NextResponse.json({ error: "Key not found" }, { status: 404 });

  return NextResponse.json({ success: true });
}