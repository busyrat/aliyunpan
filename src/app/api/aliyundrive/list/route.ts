import { getList, getToken } from "@/services/aliyundrive";
import { withRetry } from "@/app/lib/utils";
import { NextRequest, NextResponse } from "next/server";

async function treeShare(
  all_files: any[] = [],
  share_id: string,
  token: string,
  parent_file_id = "root",
) {
  const _getList = withRetry.bind(null, getList, 5, 10)
  const file_list = await _getList(share_id, token, parent_file_id);
  for (const file of file_list) {
    all_files.push(file);
    console.log(file.name);
    if (file.type === "folder") {
      await treeShare(all_files, share_id, token, file.file_id);
    }
  }
}

export async function GET(req: NextRequest) {
  const share_id = req.nextUrl.searchParams.get("share_id");

  if (share_id) {
    const share_token = await getToken(share_id);
    console.log(share_token);

    const all_files: any[] = [];
    await treeShare(all_files, share_id, share_token);

    return NextResponse.json({ error: 0, message: all_files });
  } else {
    return NextResponse.json({ error: -1, message: "请传入share_id" });
  }
}
