import { getAllFeeds, refreshFeed } from "@/app/lib/action";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET() {
  const feeds = await getAllFeeds()
  const all = await Promise.all(feeds.map((feed) => refreshFeed(feed.file_id) ))

  if (all.every(i => i > -1)) {
    return NextResponse.json({ error: 0, message: all.reduce((a, c) => a + c, 0) });
  } else {
    return NextResponse.json({ error: -1, message: '' });
  }
}
