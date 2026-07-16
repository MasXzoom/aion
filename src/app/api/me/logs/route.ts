import { NextRequest, NextResponse } from "next/server";
import { getKeyInfo, getUsageLogs } from "@/lib/api";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const info = getKeyInfo(auth);
  if (!info) return NextResponse.json({ error: "Key tidak valid" }, { status: 401 });

  const logs = getUsageLogs(info.key);
  return NextResponse.json({ logs });
}