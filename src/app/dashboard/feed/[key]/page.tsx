import { Metadata } from 'next';
import FileTree from '@/app/ui/dashboard/fileTree/table';
import { sql } from '@vercel/postgres';
import { feeds as Feed } from '@prisma/client';

export const metadata: Metadata = {
  title: 'share',
};

export default async function Page({ params }: { params: { key: string } }) {
  const [share_id, file_id] = params.key.split('_')

  const { rows } = await sql<Feed>`
    SELECT * FROM feeds
    WHERE parent_file_id = ${file_id}
  `

  return <FileTree feedCode={params.key} feeds={rows}/>
}