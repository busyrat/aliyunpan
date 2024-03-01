import { getList, getToken } from "@/services/aliyundrive";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('share_id')

  if (id) {
    const tokenData = await getToken(id)
    const token = tokenData.data.share_token
    const res = await getList(id, token)
    
    return NextResponse.json({ error: 0, message: res.data })
  } else {
    return NextResponse.json({ error: -1, message: '请传入share_id' })
  }

}
