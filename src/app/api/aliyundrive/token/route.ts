import { getToken } from "@/services/aliyundrive";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('share_id')

  if (id) {
    const token = await getToken(id)
    
    return NextResponse.json({ error: 0, message: token })
  } else {
    return NextResponse.json({ error: -1, message: '请传入share_id' })
  }

}
