import { getToken } from "@/services/aliyundrive";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const share_id = req.nextUrl.searchParams.get('share_id')

  if (!share_id) {
    return NextResponse.json({ error: -1, message: "请传入share_id" });
  }
  
  const token = await getToken(share_id)
    
  return NextResponse.json({ error: 0, message: token })
}
