'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Artplayer from './Artplayer'
import flvjs from "flv.js"
import Hls from "hls.js"

type PreviewProps = {
  file: any
}

const VideoPreview: React.FC<PreviewProps> = ({ file }) => {
  const [url, setUrl] = useState<string>('')
  useEffect(() => {
    const run = async () => {
      if (!file.share_id || !file.file_id) return
      setUrl('')
      const res = await axios.get('/api/aliyundrive/getLinkVideoPreview', {
        params: {
          file_id: file.file_id,
          share_id: file.share_id
        }
      })
      setUrl(res.data.message.video_preview_play_info.live_transcoding_task_list[0].preview_url)
    }
    run()
  }, [file.file_id, file.share_id])

  if (!url) return <div>loading...</div>

  return (
    <div>
      <div className="text-2xl">{ file.name }</div>
      <Artplayer
        option={{
          url,
          id: file.file_id || '',
          poster: file.thumbnail || '',
          title: file.name || '',
          flip: true,
          setting: true,
          playbackRate: true,
          aspectRatio: true,
          fullscreen: true,
          fullscreenWeb: true,
          miniProgressBar: true,
          autoplay: false,
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
        }}
        getInstance={(art: any) => console.info(art)}
      />
    </div>
  )
}

export default VideoPreview