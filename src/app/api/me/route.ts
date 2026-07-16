import { NextRequest, NextResponse } from "next/server";
import { getMe } from "@/lib/api";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await getMe(auth);
  if (data.error) return NextResponse.json({ error: data.error }, { status: 401 });
  return NextResponse.json(data);
}