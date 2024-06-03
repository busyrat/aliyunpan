import { Metadata } from 'next';
import { sql } from '@vercel/postgres';
import FilesTree from './components/Tree';
import { Feed } from '@/app/lib/db';

export const metadata: Metadata = {
  title: 'share',
};

type PageProps = {
  params: { 
    file_id: string
  }
}

// or Dynamic metadata
// export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
//   const { file_id } = params
//   const { rows } = await sql<Feed>`
//     SELECT * FROM feeds
//     WHERE file_id = ${file_id}
//   `
//   return {
//     title: rows[0].name,
//   }
// }

export default async function Page({ params }: PageProps) {
  const { file_id } = params

  const { rows } = await sql<Feed>`
    SELECT * FROM feeds
    WHERE file_id = ${file_id} OR parent_file_id = ${file_id}
  `

  const feedMap = rows.reduce((acc, cur) => ({...acc, [cur.file_id]: cur}), {})

  // return <FilesTable file_id={file_id} feedMap={feedMap}/>
  return <FilesTree file_id={file_id} feedMap={feedMap}></FilesTree>
}