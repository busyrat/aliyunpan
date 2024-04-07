import { NextRequest, NextResponse } from "next/server";
import AliyunDrive from "../aliyundrive";

interface Params {
  params: {
    drive: string[];
  }
}

export async function GET(req: NextRequest, { params }: Params ) {
  const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries())
  const { drive } = params
  const [ driveType, ...pathArray] = drive

  let message: any
  const path = pathArray.join('/')
  if (driveType === 'aliyundrive') {
    const { share_id, file_id } = searchParams
    if (!share_id) {
      return NextResponse.json({ error: 1, message: 'share_id is required' });
    }
    
    const drive = new AliyunDrive(share_id)
    
    if (path === 'getFile') {
      if (!file_id) {
        return NextResponse.json({ error: 1, message: 'file_id is required' });
      }
      message = await drive.getFile(file_id)  
    } else if (path === 'getList') {
      message = await drive.getList(file_id)
    } else {
      return NextResponse.json({ error: 1, message: 'path is invalid' });
    }
  }
  
  return NextResponse.json({ error: 0, message });
}
