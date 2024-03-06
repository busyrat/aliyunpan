import { NextRequest, NextResponse } from "next/server";
import { getList, getToken } from "@/services/aliyundrive";

export async function GET(req: NextRequest) {
  const share_id = req.nextUrl.searchParams.get("share_id");
  const file_id = req.nextUrl.searchParams.get("file_id") || 'root';

  if (!share_id) {
    return NextResponse.json({ error: -1, message: "请传入share_id" });
  }

  const token = await getToken(share_id);
  const list = await getList(token, share_id, file_id);
  
  return NextResponse.json({ error: 0, message: list });
}
