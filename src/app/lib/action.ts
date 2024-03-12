'use server'

import { getList, getToken } from "@/services/aliyundrive";
import { feeds as Feed, files as File, files } from "@prisma/client";
import { sql } from "@vercel/postgres"
import _ from "lodash";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/db";

export async function createFeed(values: any) {
  const { name, share_id, file_id, parent_file_id } = values
  await sql`
    INSERT INTO feeds (name, share_id, file_id, parent_file_id)
    VALUES (${name}, ${share_id}, ${file_id}, ${parent_file_id})
    ON CONFLICT (file_id) DO NOTHING;
  `
  await refreshFeed(file_id)

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

export async function refreshFeed(file_id: string) {
  const feed = await getFeed(file_id)
  
  if (!feed) return false
  const { share_id } = feed
  if (!share_id) return false

  const token = await getToken(share_id);
  const list = await getList(token, share_id, file_id);
  const r = await prisma.files.createMany({
    data: list.map((file: any) => _.pick(file, ['name', 'drive_id', 'domain_id', 'file_id', 'share_id', 'type', 'created_at', 'updated_at', 'parent_file_id', 'file_extension', 'mime_type', 'mime_extension', 'size', 'category', 'punish_flag'])),
    skipDuplicates: true
  })
  console.log(`file add ${r.count}`);
  
  return true
}

export async function getFiles(parent_file_id: string) {
  const { rows } = await sql<File>`
    SELECT * FROM files
    WHERE parent_file_id = ${parent_file_id};
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

type FileMap = {
  [key: string]: files
}

export async function getFeedDiff(file_id: string) {
  const { rows: last } = await sql`
    SELECT * FROM files
    WHERE parent_file_id = ${file_id};
  `
  
  const share_id = last[0].share_id
  const token = await getToken(share_id)
  const current = await getList(token, share_id, file_id)

  const currentObject: FileMap = current.reduce((a, c) => ({ ...a, [c.file_id]: c }), {})
  const lastObject: FileMap = last.reduce((a, c) => ({ ...a, [c.file_id]: c }), {})
  
  // return _.difference(last, current)
  const increase = _.difference(current.map(l => l.file_id), last.map(l => l.file_id)).map(l => currentObject[l])
  const decrease = _.difference(last.map(l => l.file_id), current.map(l => l.file_id)).map(l => lastObject[l])
  return { increase, decrease, currentObject, lastObject }
}

