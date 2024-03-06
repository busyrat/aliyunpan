import { fetchFile } from "@/app/lib/data";
import { getList, getToken } from "@/services/aliyundrive";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { path_key: string } } ) {
  // const share_id = req.nextUrl.searchParams.get('share_id')
  // const file_id = req.nextUrl.searchParams.get('file_id') || 'root'
  console.log(params.path_key);
  
  // let message: any
  // switch (params.path_key) {
  //   case 'token':
  //     // message = await getToken(share_id)
  //     message = 1
      
  //     break;
  //     case 'list':
  //       message += 2
  //     // const token = await getToken(share_id)
  //     // message = await getList(token, share_id, file_id)
  //     break;
  //   default:
  //     // return NextResponse.json({ error: 404 })
  //     break;
  // }
  // console.log(params);
  

  return NextResponse.json({ error: 0, message: '' })
}
