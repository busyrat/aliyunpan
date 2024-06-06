'use client'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

type DownloadLinkProps = {
  data: any
}

const DownloadLink: React.FC<DownloadLinkProps> = ({ data }) => {
  const [url, setUrl] = useState<string>('')

  useEffect(() => {
    const run = async () => {
      if (!data.share_id || !data.file_id || data.type !== 'file') return
      setUrl('')
      const res = await axios.get('/api/aliyundrive/getLink', {
        params: {
          file_id: data.file_id,
          share_id: data.share_id
        }
      })
      setUrl(res.data.message.url)
    }
    run()
  }, [data.file_id, data.share_id, data.type])

  return (
    <div>
      Preview
      {
        url 
        ? <>
          <a href={url} target="_blank" download={data.name} rel="noopener noreferrer">{data.title}</a>
          <Image width={300} height={300} src={url} alt={data.title} />
        </>
        : data.title
      }
    </div>
  )
}

export default DownloadLink