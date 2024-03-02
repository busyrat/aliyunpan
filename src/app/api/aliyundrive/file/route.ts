import { fetchFile } from "@/app/lib/data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const share_id = req.nextUrl.searchParams.get('share_id')
  const id = req.nextUrl.searchParams.get('id') || 'root'

  if (share_id) {
    const items = await fetchFile(share_id, id)
    
    return NextResponse.json({ error: 0, message: items })
  } else {
    return NextResponse.json({ error: -1, message: '请传入share_id' })
  }

}
