import { NextRequest, NextResponse } from "next/server";
import { loginWithKey } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const { api_key } = await req.json();
    if (!api_key) {
      return NextResponse.json({ error: "api_key diperlukan" }, { status: 400 });
    }
    const data = await loginWithKey(api_key);
    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 401 });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}