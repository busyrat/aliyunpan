import { Metadata } from 'next';
import { sql } from '@vercel/postgres';
import FeedsTable from './components/Table';
import { Feed, File } from '@/app/lib/db';

export const metadata: Metadata = {
  title: '全部订阅',
};

export interface Row extends Feed {
  mixes: File[]
}

export default async function Page() {
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

  const { rows } = await sql<Row>`
    SELECT 
      f.*, 
      CASE WHEN COUNT(c) = 0 then '[]' ELSE json_agg(c) end AS mixes
    FROM feeds f
    LEFT JOIN files c ON c.parent_file_id = f.file_id AND c.read_flag IS NULL  
    GROUP BY f.file_id, f.name, f.share_id, f.id
  `

  // 第三行也可以替换成下面这一句 https://stackoverflow.com/questions/24155190/postgresql-left-join-json-agg-ignore-remove-null
  // COALESCE(NULLIF(json_agg(c)::TEXT, '[null]'), '[]')::JSON AS mixes

  return <>
    <FeedsTable feeds={rows} />
  </>
}