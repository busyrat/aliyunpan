'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Artplayer from './ArtPlayer';
import Hls from 'hls.js/dist/hls.min'

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
              // type: 'm3u8',
              // customType: {
              //     m3u8: m3u8Hls,
              // },
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
            getInstance={(art) => console.info(art)}
          />
        </>
        : 'loading...'
      }
    </div>
  )
}

var hlsErrorHandler = function (event, data, art) {
  if (art.hls.error == -1) {
      console.log("在处理了")
      return
  }
  var errorType = data.type;
  var errorDetails = data.details;
  var errorFatal = data.fatal;


  console.log(errorType)
  console.log(errorDetails)
  console.log(errorFatal)
  if (art.hls.error) {
      art.hls.error += 1;
  } else {
      art.hls.error = 1
  }
  if (data.details == 'fragLoadError' && (errorFatal || art.hls.error >= 4)) {
      art.hls.error = -1;
      // retry403(art)

  } else if (errorType == 'networkError' && errorFatal) {
      // ElNotification({
      //     title: '网络错误',
      //     message: '请检查网络配置后，刷新页面',
      //     type: 'error',
      // })
  }


}

function m3u8Hls(video, url, art) {
  if(art.qualityHtml == ' 原画'){
      video.src = url ;
      return;
  }

  art.hls = new Hls();
  art.hls.loadSource(url);

  art.hls.attachMedia(video);

  video.addEventListener('loadstart', function (e) {
      console.log('提示视频的元数据已加载' + video.src)
      if (art.hlsCurrentTime403) {
          video.currentTime = art.hlsCurrentTime403
      }
  })

  art.hls.on(Hls.Events.ERROR, function (e, d) {
      hlsErrorHandler(e, d, art)
  })

}

export default Preview