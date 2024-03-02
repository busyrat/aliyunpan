import FeedsTree from "@/app/ui/dashboard/feedsTree";
import Link from "next/link";
import { fetchFeeds } from "../lib/data";
import { TreeDataNode } from "antd";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const feeds = await fetchFeeds()

  const tree: TreeDataNode[] = [{
    title: 'All',
    key: 'all',
    children: feeds.map(feed => ({
      title: feed.name,
      key: feed.id,
      isLeaf: true,
      ...feed
    }))
  }]

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <div className="w-10 mx-auto">
          <Link href="/">HOME</Link>
        </div>
        <FeedsTree data={tree} ></FeedsTree>
      </div>
      <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}