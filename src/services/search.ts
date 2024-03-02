import { File } from "@/app/lib/definitionis";
import { sql } from "@vercel/postgres";

async function getChildren(rows: File[]) {
  for (const row of rows) {
    if (row.type === 'folder') {
      const { rows: children }: { rows: File[] } = await sql`SELECT * from files where parent_file_id = ${row.file_id} `;
      row.children = children
      await getChildren(children)
    }
  }
}

export const getFiles = async (_keyword: string) => {
  const keyword = `%${_keyword}%`

  const { rows }: { rows: File[] } = await sql`SELECT * from files where name like ${keyword} `;

  await getChildren(rows)

  return rows
};
