import { NextRequest, NextResponse } from "next/server";
import { addFeed, getFeed } from "@/services/dashboard";

export async function GET(req: NextRequest) {
  const share_id = req.nextUrl.searchParams.get("share_id");
  const file_id = req.nextUrl.searchParams.get("file_id") || 'root';

  if (!share_id) {
    return NextResponse.json({ error: -1, message: "请传入share_id" });
  }

  const list = await getFeed(share_id, file_id)
  
  return NextResponse.json({ error: 0, message: list });
}

export async function POST(req: NextRequest) {
  const { share_id, file_id, name } = await req.json()

  if (!share_id) {
    return NextResponse.json({ error: -1, message: "请传入share_id" });
  }

  let message

  try {
    message = await addFeed(share_id, file_id, name)
  } catch (error) {
    return NextResponse.json({ error: -1, message: '请传入完整的参数' });
  }
  
  return NextResponse.json({ error: 0, message });
}
