import { Metadata } from 'next';
import FileTree from '@/app/ui/dashboard/fileTree/index';

export const metadata: Metadata = {
  title: 'share',
};

export default async function Page({ params }: { params: { key: string } }) {
  return <FileTree feedCode={params.key} />
}