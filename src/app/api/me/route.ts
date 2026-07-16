import { NextRequest, NextResponse } from "next/server";
import { getKeyInfo } from "@/lib/api";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const info = getKeyInfo(auth);
  if (!info) return NextResponse.json({ error: "Key tidak valid" }, { status: 401 });

  return NextResponse.json({
    name: info.name,
    role: info.role,
    key: info.key,
    status: info.status,
    remain_quota: info.remain_quota,
    total_quota: info.total_quota,
    unlimited_quota: info.unlimited_quota,
    expired_time: info.expired_time,
    created_at: info.created_at,
    last_used: info.last_used,
  });
}