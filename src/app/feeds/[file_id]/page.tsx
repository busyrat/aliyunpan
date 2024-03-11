import { Metadata } from 'next';
import { sql } from '@vercel/postgres';
import { feeds as Feed } from '@prisma/client';
import FilesTable from './components/Table';

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
    WHERE file_id = ${file_id}
  `

  const { rows: prows } = await sql<Feed>`
    SELECT * FROM feeds
    WHERE parent_file_id = ${file_id}
  `
  const feedMap = rows.concat(prows).reduce((acc, cur) => ({...acc, [cur.file_id as string]: cur}), {})
  
  return <FilesTable file_id={file_id} feedMap={feedMap}/>
}