'use server'

import { sql } from "@vercel/postgres"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createFeed(values: any) {
  const { name, share_id, file_id, parent_file_id } = values
  await sql`
    INSERT INTO feeds (name, share_id, file_id, parent_file_id)
    VALUES (${name}, ${share_id}, ${file_id}, ${parent_file_id})
    ON CONFLICT (file_id) DO NOTHING;
  `
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