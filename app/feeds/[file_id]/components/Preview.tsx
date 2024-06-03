'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Artplayer from './Artplayer';

type PreviewProps = {
  data: any
}

const Preview: React.FC<PreviewProps> = ({ data }) => {
  const [url, setUrl] = useState<string>('https://artplayer.org/assets/sample/video.mp4')

  useEffect(() => {
    const run = async () => {
      setUrl('')
      const res = await axios.get('/api/proxy/aliyundrive/getLink', {
        params: {
          file_id: data.file_id,
          share_id: data.share_id
        }
      })
      setUrl(res.data.message.url)
    }
    run()
  }, [data.file_id, data.share_id])

  return (
    <div>
      Preview
      {
        url 
        ? <>
          <a href={url} target="_blank" download={data.name} rel="noopener noreferrer">{data.title}</a>
          <Artplayer
            option={{
              url,
              id: data.file_id || '',
              poster: data.thumbnail || '',
              title: data.name || '',
              flip: true,
              setting: true,
              playbackRate: true,
              aspectRatio: true,
              fullscreen: true,
              fullscreenWeb: true,
              miniProgressBar: true,
              autoplay: true,
              screenshot: true,
              hotkey: false,
              airplay: true,
              theme: '#23ade5',
              volume: 1.0,
              contextmenu: [],
            }}
            style={{
              width: '600px',
              height: '400px',
              margin: '60px auto 0',
            }}
            getInstance={(art: any) => console.info(art)}
          />
        </>
        : 'loading...'
      }
    </div>
  )
}

export default Preview