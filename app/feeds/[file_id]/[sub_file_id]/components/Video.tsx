'use client'
import axios from 'axios'
import React, { use, useCallback, useEffect, useState } from 'react'
import Artplayer from './Artplayer'
import flvjs from "flv.js"
import Hls from "hls.js"
import { Button, Radio, RadioChangeEvent } from 'antd';
import { copyFile, getLink2 } from '@/app/lib/action'

type PreviewProps = {
  file: any
}

type PlayerType = 'plain' | 'preview' | ''

const VideoPreview: React.FC<PreviewProps> = ({ file }) => {
  const { share_id, file_id } = file

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

  const [type, setType] = useState<PlayerType>('preview')
  const onChange = useCallback((e: RadioChangeEvent) => {
    setType('')
    setTimeout(() => {
      setType(e.target.value)
    }, 200);
  }, [])

  if (!url || !file.link.url) return <div>loading...</div>

  const playerOption = {
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
  }

  const handleCopyFile = async () => {
    const r = await copyFile({ share_id, file_id })
    console.log(r);
    
    // const r2 = await getLink2({ file_id: r.file_id })
    // console.log(r2);
  }

  return (
    <div>
      <div className="text-2xl">
        <span className='mr-4'>
          { file.name }
        </span>
        <Radio.Group onChange={onChange} value={type}>
          <Radio  value="plain">普通</Radio >
          <Radio  value="preview">2分钟</Radio >
        </Radio.Group>
        <Button onClick={handleCopyFile}>转存</Button>
      </div>
      {
        type === 'plain' && <Artplayer
          option={{
            ...playerOption,
            id: `${file.file_id}-plain` || '',
            type: (file.name || '').split(".").pop() ?? "",
            url: file.link.url || '',

          }}
          style={{
            width: '600px',
            height: '400px',
          }}
          getInstance={(art: any) => console.info(art)}
        />
      }
      {
        type === 'preview' && <Artplayer
          option={{
            ...playerOption,
            id: `${file.file_id}-preview` || '',
            type: 'm3u8',
            url
          }}
          style={{
            width: '600px',
            height: '400px',
          }}
          getInstance={(art: any) => console.info(art)}
        />
      }
      
    </div>
  )
}

export default VideoPreview