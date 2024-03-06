import { getList, getToken } from "@/services/aliyundrive";
import { withRetry } from "@/app/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import prisma from "@/app/lib/db";
import _ from "lodash"
// import { insertFile } from "@/scripts/seed"

function insertFile(sql: any, file: any) {
  return sql`
    INSERT INTO files (name, drive_id, domain_id, file_id, share_id, type, created_at, updated_at, parent_file_id, file_extension, mime_type, mime_extension, size, category, punish_flag)
    VALUES (${file.name}, ${file.drive_id}, ${file.domain_id}, ${file.file_id}, ${file.share_id}, ${file.type}, ${file.created_at}, ${file.updated_at}, ${file.parent_file_id},  ${file.file_extension}, ${file.mime_type}, ${file.mime_extension}, ${file.size}, ${file.category}, ${file.punish_flag})
    ON CONFLICT (file_id) DO NOTHING;
  `
}

async function treeShare(
  all_files: any[] = [],
  share_id: string,
  token: string,
  parent_file_id = "root",
) {
  const _getList = withRetry.bind(null, getList, 5, 10)
  const file_list = await _getList(token, share_id, parent_file_id);

  all_files.concat(file_list);
  try {
    await prisma.files.createMany({
      data: file_list.map((file: any) => _.pick(file, ['name', 'drive_id', 'domain_id', 'file_id', 'share_id', 'type', 'created_at', 'updated_at', 'parent_file_id', 'file_extension', 'mime_type', 'mime_extension', 'size', 'category', 'punish_flag'])),
      skipDuplicates: true
    })    
  } catch (error) {
    console.log('insert file failed!', error, file_list);
  }

  for (const file of file_list) {
    if (file.type === "folder") {
      await treeShare(all_files, share_id, token, file.file_id);
      console.log('insert success!', file.name);
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
    // const all_files = await prisma.files.count({})

    return NextResponse.json({ error: 0, message: all_files });
  } else {
    return NextResponse.json({ error: -1, message: "请传入share_id" });
  }
}
