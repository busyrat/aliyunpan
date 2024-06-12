'use server'

import { getList as getAliyundriveList, getFile as getAliyundriveFile, getLink as getAliyundriveLink } from "@/services/aliyundriveShare";
import { feeds as Feed, files as File, files } from "@prisma/client";
import { sql } from "@vercel/postgres"
import _ from "lodash";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma, { FeedCreate, FileMap } from "@/app/lib/db";

export async function createFeed(values: FeedCreate) {
  const { name, share_id, file_id, parent_file_id } = values
  await sql`
    INSERT INTO feeds (name, share_id, file_id, parent_file_id)
    VALUES (${name}, ${share_id}, ${file_id}, ${parent_file_id})
    ON CONFLICT (file_id) DO NOTHING;
  `
  await createFile(file_id)

  revalidatePath('/feeds/all');
  redirect('/feeds/all');
}

export async function removeFeed(id: string) {
  await sql`
    DELETE FROM feeds
    WHERE id = ${id}
  `
  revalidatePath('/feeds/all');
  redirect('/feeds/all');
}

export async function createFile(file_id: string) {
  await refreshFeed(file_id, true)
}

export async function refreshAllFeeds(): Promise<number> {
  const feeds = await getAllFeeds()
  const all = await Promise.all(feeds.map((feed) => refreshFeed(feed.file_id) ))
  
  let res
  if (all.every(i => i > -1)) {
    res = all.reduce((a, c) => a + c, 0)
  } else {
    res = -1
  }

  return res
}

export async function refreshFeed(file_id: string, isCreate: boolean = false): Promise<number> {
  try {
    const feed = await getFeed(file_id)
  
    if (!feed?.share_id) return -1
    const { share_id } = feed
  
    const list = await getAliyundriveList({ share_id, file_id });
    
    const r = await prisma.files.createMany({
      data: list.map((file: any) => ({
        read_flag: isCreate ? 1 : null,
        ..._.pick(file, ['name', 'drive_id', 'domain_id', 'file_id', 'share_id', 'type', 'created_at', 'updated_at', 'parent_file_id', 'file_extension', 'mime_type', 'mime_extension', 'size', 'category', 'punish_flag'])
      })),
      skipDuplicates: true
    })
    console.log(`feed refresh success. ${file_id} insert ${r.count}`);
    return r.count
  } catch (error) {
    console.log(`file refresh failed. ${file_id}`, error);
    return -1
  }
}

export async function getFiles(parent_file_id: string) {
  const { rows } = await sql<File>`
    SELECT * FROM files
    WHERE parent_file_id = ${parent_file_id};
  `
  return rows
}

export async function updateFileRead(file_id: string) {
  await sql`
    UPDATE files
    SET read_flag = 1
    WHERE file_id = ${file_id};
  `
}

export async function updateAllFilesRead() {
  await sql`
    UPDATE files
    SET read_flag = 1
    WHERE 1 = 1;
  `
}

export async function getList({ share_id, file_id }: {
  share_id: string,
  file_id: string
}) {
  const list = await getAliyundriveList({share_id, file_id});
  return list
}

export async function getFile({ share_id, file_id }: {
  share_id: string,
  file_id: string
}) {
  const file = await getAliyundriveFile({share_id, file_id})
  return file
}

export async function getLink({ share_id, file_id }: {
  share_id: string,
  file_id: string
}) {
  const file = await getAliyundriveLink({share_id, file_id})
  return file
}

export async function getAllFeeds() {
  const { rows } = await sql`
    SELECT * FROM feeds;
  `

  return rows
}

export async function getFeed(file_id: string): Promise<Feed | null> {
  const { rows } = await sql<Feed>`
    SELECT * FROM feeds
    WHERE file_id = ${file_id}
  `
  if (rows.length > 0) {
    return rows[0]
  }

  return null
}


export async function getFeedDiff(file_id: string) {
  const { rows: last } = await sql`
    SELECT * FROM files
    WHERE parent_file_id = ${file_id};
  `
  
  const share_id = last[0].share_id
  const current = await getAliyundriveList({ share_id, file_id })

  const currentObject: FileMap = current.reduce((a, c) => ({ ...a, [c.file_id]: c }), {})
  const lastObject: FileMap = last.reduce((a, c) => ({ ...a, [c.file_id]: c }), {})
  
  // return _.difference(last, current)
  const increase = _.difference(current.map(l => l.file_id), last.map(l => l.file_id)).map(l => currentObject[l])
  const decrease = _.difference(last.map(l => l.file_id), current.map(l => l.file_id)).map(l => lastObject[l])
  return { increase, decrease, currentObject, lastObject }
}

export async function getFeedWithRead () {
   // const { rows } = await sql<Row>`
  //   SELECT * FROM feeds
  // `

  // for (const row of rows) {
  //   const { rows: mixes } = await sql<files>`
  //     SELECT * FROM files
  //     WHERE parent_file_id = ${row.file_id}
  //     AND read_flag IS NULL
  //   `
  //   // console.log(children[0]);
  //   row.mixes = mixes
  // }

  const { rows } = await sql`
    SELECT 
      f.*, 
      CASE WHEN COUNT(c) = 0 then '[]' ELSE json_agg(c) end AS mixes
    FROM feeds f
    LEFT JOIN files c ON c.parent_file_id = f.file_id AND c.read_flag IS NULL  
    GROUP BY f.file_id, f.name, f.share_id, f.id
  `

  // 第三行也可以替换成下面这一句 https://stackoverflow.com/questions/24155190/postgresql-left-join-json-agg-ignore-remove-null
  // COALESCE(NULLIF(json_agg(c)::TEXT, '[null]'), '[]')::JSON AS mixes
  return rows
}

