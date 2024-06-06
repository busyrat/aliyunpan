'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Artplayer from './Artplayer';
import flvjs from "flv.js"
import Hls from "hls.js"

type PreviewProps = {
  data: any
}

const Preview: React.FC<PreviewProps> = ({ data }) => {
  const [url, setUrl] = useState<string>('')
  useEffect(() => {
    const run = async () => {
      if (!data.share_id || !data.file_id) return
      setUrl('')
      const res = await axios.get('/api/aliyundrive/getLinkVideoPreview', {
        params: {
          file_id: data.file_id,
          share_id: data.share_id
        }
      })
      setUrl(res.data.message.video_preview_play_info.live_transcoding_task_list[0].preview_url)
    }
    run()
  }, [data.file_id, data.share_id])

  if (!url) return <div>loading...</div>

  return (
    <div>
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
          moreVideoAttr: {
            // @ts-ignore
            "webkit-playsinline": true,
            playsInline: true,
            crossOrigin: 'anonymous',
          },
          // type: (data.name || '').split(".").pop() ?? "",
          type: "m3u8",
          customType: {
            flv: function (video: HTMLMediaElement, url: string) {
              const flvPlayer = flvjs.createPlayer(
                {
                  type: "flv",
                  url: url,
                },
                { referrerPolicy: "same-origin" },
              )
              flvPlayer.attachMediaElement(video)
              flvPlayer.load()
            },
            m3u8: function (video: HTMLMediaElement, url: string) {
              const hls = new Hls()
              hls.loadSource(url)
              hls.attachMedia(video)
              if (!video.src) {
                video.src = url
              }
            },
          }
        }}
        style={{
          width: '600px',
          height: '400px',
          margin: '60px auto 0',
        }}
        getInstance={(art: any) => console.info(art)}
      />
    </div>
  )
}

export default Preview