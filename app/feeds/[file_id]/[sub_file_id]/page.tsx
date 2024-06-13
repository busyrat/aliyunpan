import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { sql } from '@vercel/postgres';
import { Feed } from '@/app/lib/db';
import { getFile, getLink } from '@/app/lib/action';
import MarkdownPreview from './components/Markdown';
import VideoPreview from './components/Video';
import ImagePreview from './components/Image';
import Download from './components/Download';
import Folder from './components/Folder';

export const metadata: Metadata = {
  title: 'preview',
};

type PageProps = {
  params: { 
    file_id: string,
    sub_file_id: string,
    share_id: string
  },
  searchParams: {
    viewport: string
  }
}

export default async function Page(props: PageProps) {
  const { params, searchParams } = props
  const { file_id, sub_file_id } = params

  const { rows } = await sql<Feed>`
    SELECT * FROM feeds
    WHERE file_id = ${file_id}
  `
  const { share_id } = rows[0]
  
  const file = await getFile({ share_id, file_id: sub_file_id })
  
  if (file.type === 'folder') {
    return <Folder file={file} />
  }

  const link = await getLink({ share_id, file_id: sub_file_id })
  file.link = link
  
  let Preview: React.FC<{ file: File }> = () => <></>
  switch (file.file_extension) {
    case 'md':
      Preview = MarkdownPreview
      break;
    case 'mkv':
    case 'mp4':
    case 'rmvb':
    case 'mov':
    case 'avi':
    case 'flv':
      Preview = VideoPreview
      break;
    case 'jpg':
      Preview = ImagePreview
      break;
    default:
      break;
  }
  return <div className='w-full h-full px-4'>
    <Download file={file} />
    <Preview file={file} />
  </div>
}