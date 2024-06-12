'use client'
import { createFeed, getFeed } from '@/app/lib/action'
import { Feed } from '@/app/lib/db'
import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'

type Props = {
  file: any
}


const Folder: React.FC<Props> = ({ file }) => {
  const [feed, setFeed] = useState<Feed>()
  useEffect(() => {
    async function run () {
      const feed = await getFeed(file.file_id)
      setFeed(feed as Feed)
    }
    run()
  }, [file.file_id])

  return (
    <div>
      {file.name}
      {
        feed
        ? <HeartFilled style={{ color: 'red' }} />
        : <HeartOutlined onClick={() => createFeed(file)} />
      }
    </div>
  )
}

export default Folder