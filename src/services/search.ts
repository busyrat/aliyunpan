import { sql } from "@vercel/postgres";

async function getChildren(rows) {
  for (const row of rows) {
    if (row.type === 'folder') {
      const { rows: children } = await sql`SELECT * from files where parent_file_id = ${row.file_id} `;
      row.children = children
      await getChildren(children)
    }
  }
}

export const getFiles = async (_keyword: string) => {
  const keyword = `%${_keyword}%`

  const { rows } = await sql`SELECT * from files where name like ${keyword} `;

  await getChildren(rows)

  return rows
};
