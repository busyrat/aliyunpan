import { getFile, getLink, getLinkVideoPreview, getList } from "@/services/aliyundriveShare";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: {
    path: string[];
  }
}

export async function GET(req: NextRequest, { params }: Params ) {
  const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries())
  const { path } = params
  const [ handle, ...pathArray] = path

  let message: any
  const { share_id, file_id } = searchParams
  
  switch (handle) {
    case 'getFile':
      message = await getFile({ share_id, file_id })  
      break;
    case 'getList':
      message = await getList({ share_id, file_id })
      break;
    case 'getLink':
      message = await getLink({ share_id, file_id })
      break;
    case 'getLinkVideoPreview':
      message = await getLinkVideoPreview({ share_id, file_id })
      break;
    default:
      break;
  }
  
  return NextResponse.json({ error: 0, message });
}
