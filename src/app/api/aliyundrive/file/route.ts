import { NextRequest, NextResponse } from "next/server";
import { getFile, getToken } from "@/services/aliyundrive";

export async function GET(req: NextRequest) {
  const share_id = req.nextUrl.searchParams.get("share_id");
  const file_id = req.nextUrl.searchParams.get("file_id") || 'root';

  if (!share_id) {
    return NextResponse.json({ error: -1, message: "请传入share_id" });
  }

  const file = await getFile(share_id, file_id);
  
  return NextResponse.json({ error: 0, message: file });
}
