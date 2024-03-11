import { Metadata } from 'next';
import { sql } from '@vercel/postgres';
import { feeds as Feed } from '@prisma/client';
import FeedsTable from './components/Table';

export const metadata: Metadata = {
  title: '全部订阅',
};

export default async function Page() {
  const { rows } = await sql<Feed>`
    SELECT * FROM feeds
  `

  return <>
    <FeedsTable feeds={rows} />
  </>
}