import { getFiles } from "@/services/search";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')

  if (q) {    
    const files = await getFiles(q)
    
    return NextResponse.json({ error: 0, message: files })
  } else {
    return NextResponse.json({ error: -1, message: '请传入share_id' })
  }

}
