import { Metadata } from 'next';
import FeedsTable from './components/Table';

export const metadata: Metadata = {
  title: '全部订阅',
};

export default async function Page() {
  return <>
    <FeedsTable />
  </>
}