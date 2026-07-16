import { NextRequest, NextResponse } from "next/server";
import { getKeyInfo } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const { api_key } = await req.json();
    if (!api_key) {
      return NextResponse.json({ error: "api_key diperlukan" }, { status: 400 });
    }

    const info = getKeyInfo(api_key);
    if (!info) {
      return NextResponse.json({ error: "API key tidak ditemukan" }, { status: 401 });
    }

    if (info.status !== "active") {
      return NextResponse.json({ error: "API key sudah tidak aktif" }, { status: 403 });
    }

    if (info.expired_time !== -1 && info.expired_time < Date.now() / 1000) {
      return NextResponse.json({ error: "API key sudah expired" }, { status: 403 });
    }

    return NextResponse.json({
      name: info.name,
      role: info.role,
      remain_quota: info.remain_quota,
      total_quota: info.total_quota,
      unlimited_quota: info.unlimited_quota,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}