import { NextRequest, NextResponse } from "next/server";
import { getAllKeys, createKey, updateKey, deleteKey, getMe, getUsageLogs } from "@/lib/api";

function getAuth(req: NextRequest): string {
  return req.headers.get("authorization")?.replace("Bearer ", "") || "";
}

// GET /api/admin/keys — list all keys
export async function GET(req: NextRequest) {
  const auth = getAuth(req);
  const me = auth ? await getMe(auth) : null;
  if (me?.role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const url = new URL(req.url);
  const segments = url.pathname.replace("/api/admin/keys", "").replace(/^\//, "");

  // GET /api/admin/keys/:key/usage
  if (segments && segments.endsWith("/usage")) {
    const targetKey = segments.replace("/usage", "");
    const logs = await getUsageLogs(targetKey);
    return NextResponse.json({ key: targetKey, logs: logs.logs || [] });
  }

  const data = await getAllKeys(auth);
  if (data.error) return NextResponse.json(data, { status: 403 });

  return NextResponse.json({
    keys: (data.keys || []).map((k: any) => ({
      name: k.name,
      key: (k.token || k.key || "").slice(0, 12) + "..." + (k.token || k.key || "").slice(-4),
      _full: k.token || k.key,
      status: k.status,
      remain_quota: k.remain_quota || 0,
      total_quota: k.total_quota || 0,
      unlimited_quota: Boolean(k.unlimited_quota),
      expired_time: k.expired_time || -1,
      created_at: k.created_at,
      role: k.role || "user",
    })),
  });
}

// POST /api/admin/keys — create new key
export async function POST(req: NextRequest) {
  const auth = getAuth(req);
  const me = auth ? await getMe(auth) : null;
  if (me?.role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const body = await req.json();
  const data = await createKey(auth, {
    name: body.name || "User Key",
    quota: body.quota || 25000000,
    days: body.days || 30,
    unlimited_quota: body.quota >= 999999999,
  });
  if (data.error) return NextResponse.json(data, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}

// PUT /api/admin/keys/:key — update key
export async function PUT(req: NextRequest) {
  const auth = getAuth(req);
  const me = auth ? await getMe(auth) : null;
  if (me?.role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const url = new URL(req.url);
  const targetKey = decodeURIComponent(url.pathname.replace("/api/admin/keys/", ""));
  const body = await req.json();
  const data = await updateKey(auth, targetKey, body);
  if (data.error) return NextResponse.json(data, { status: 404 });
  return NextResponse.json(data);
}

// DELETE /api/admin/keys/:key — delete key
export async function DELETE(req: NextRequest) {
  const auth = getAuth(req);
  const me = auth ? await getMe(auth) : null;
  if (me?.role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const url = new URL(req.url);
  const targetKey = decodeURIComponent(url.pathname.replace("/api/admin/keys/", ""));
  const data = await deleteKey(auth, targetKey);
  if (data.error) return NextResponse.json(data, { status: 404 });
  return NextResponse.json(data);
}