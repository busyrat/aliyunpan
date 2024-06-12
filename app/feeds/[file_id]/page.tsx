import { Feed } from '@/app/lib/db';
import { sql } from '@vercel/postgres';
import { Metadata } from 'next';

type PageProps = {
  params: { 
    file_id: string,
  },
}

// export const metadata: Metadata = {
//   title: 'share',
// };
// or Dynamic metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { file_id } = params
  const { rows } = await sql<Feed>`
    SELECT * FROM feeds
    WHERE file_id = ${file_id}
  `
  
  return {
    title: rows[0]?.name || 'share',
  }
}

export default async function Page({ params }: PageProps) { 
  return <div>{ params.file_id }</div>
}