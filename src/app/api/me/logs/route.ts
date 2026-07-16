import { NextRequest, NextResponse } from "next/server";
import { getUsageLogs } from "@/lib/api";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await getUsageLogs(auth);
  if (data.error) return NextResponse.json({ error: data.error }, { status: 401 });
  return NextResponse.json(data);
}