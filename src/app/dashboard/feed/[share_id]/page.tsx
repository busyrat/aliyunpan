import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { fetchFile } from '@/app/lib/data';
import FileTree from '@/app/ui/dashboard/fileTree';

export const metadata: Metadata = {
  title: 'share',
};

export default async function Page({ params }: { params: { share_id: string } }) {
  const { share_id } = params;
  const files = await fetchFile(share_id)

  return (
    <div>
      {
        files.map(file => <FileTree key={file.file_id} treeData={[ [file] ]}/> )
      }
    </div>
  );
}