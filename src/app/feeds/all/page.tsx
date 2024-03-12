import { Metadata } from 'next';
import { sql } from '@vercel/postgres';
import { feeds, files } from '@prisma/client';
import FeedsTable from './components/Table';

export const metadata: Metadata = {
  title: '全部订阅',
};

export interface Row extends feeds {
  mixes: files[]
}

export default async function Page() {
  const { rows } = await sql<Row>`
    SELECT * FROM feeds
  `

  for (const row of rows) {
    const { rows: mixes } = await sql<files>`
      SELECT * FROM files
      WHERE parent_file_id = ${row.file_id}
      AND read_flag IS NULL
    `
    // console.log(children[0]);
    row.mixes = mixes
  }

  return <>
    <FeedsTable feeds={rows} />
  </>
}