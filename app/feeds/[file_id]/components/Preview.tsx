'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Artplayer from './Artplayer';
import flvjs from "flv.js"

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
      // setUrl(`
      // https://cn-beijing-data.aliyundrive.net/J9Vb08kN%2F77966101%2F60feb3d65a51491cba1c4d79a241f5505756fa26%2F60feb3d67c1b8c40fe474ef58c776d651478e6c4?callback=eyJjYWxsYmFja1VybCI6Imh0dHA6Ly9iajI5LmFwaS1ocC5hbGl5dW5wZHMuY29tL3YyL2ZpbGUvZG93bmxvYWRfY2FsbGJhY2siLCJjYWxsYmFja0JvZHkiOiJodHRwSGVhZGVyLnJhbmdlPSR7aHR0cEhlYWRlci5yYW5nZX1cdTAwMjZidWNrZXQ9JHtidWNrZXR9XHUwMDI2b2JqZWN0PSR7b2JqZWN0fVx1MDAyNmRvbWFpbl9pZD0ke3g6ZG9tYWluX2lkfVx1MDAyNnVzZXJfaWQ9JHt4OnVzZXJfaWR9XHUwMDI2ZHJpdmVfaWQ9JHt4OmRyaXZlX2lkfVx1MDAyNmZpbGVfaWQ9JHt4OmZpbGVfaWR9XHUwMDI2cGRzX3BhcmFtcz0ke3g6cGRzX3BhcmFtc31cdTAwMjZ2ZXJzaW9uPSR7eDp2ZXJzaW9ufSIsImNhbGxiYWNrQm9keVR5cGUiOiJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQiLCJjYWxsYmFja1N0YWdlIjoiYmVmb3JlLWV4ZWN1dGUiLCJjYWxsYmFja0ZhaWx1cmVBY3Rpb24iOiJpZ25vcmUifQ%3D%3D&callback-var=eyJ4OmRvbWFpbl9pZCI6ImJqMjkiLCJ4OnVzZXJfaWQiOiI5ODZkNGU2Yjg5ZjY0NjYwODdlZjRiYjk2OGZkYmMxZiIsIng6ZHJpdmVfaWQiOiIyMDA2NjEyIiwieDpmaWxlX2lkIjoiNjQxMTU2YTFmZWY5MDFmZjY0YWI0M2MwYjRiZjdiYmVkNTdlM2JlYyIsIng6cGRzX3BhcmFtcyI6IntcImFwXCI6XCJwSlpJbk5ITjJkWldrOHFnXCJ9IiwieDp2ZXJzaW9uIjoidjMifQ%3D%3D&di=bj29&dr=2006612&f=641156a1fef901ff64ab43c0b4bf7bbed57e3bec&pds-params=%7B%22ap%22%3A%22pJZInNHN2dZWk8qg%22%7D&response-content-disposition=attachment%3B%20filename%2A%3DUTF-8%27%27%25E9%2581%2597%25E6%2584%25BF%25E6%25B8%2585%25E5%258D%2595.2007.mp4&security-token=CAISvgJ1q6Ft5B2yfSjIr5fFMuriua9yhIWfRHfhpXoRTb5qtoPeqjz2IHhMf3NpBOkZvvQ1lGlU6%2Fcalq5rR4QAXlDfNW26NVfBqFHPWZHInuDox55m4cTXNAr%2BIhr%2F29CoEIedZdjBe%2FCrRknZnytou9XTfimjWFrXWv%2Fgy%2BQQDLItUxK%2FcCBNCfpPOwJms7V6D3bKMuu3OROY6Qi5TmgQ41Uh1jgjtPzkkpfFtkGF1GeXkLFF%2B97DRbG%2FdNRpMZtFVNO44fd7bKKp0lQLs0ARrv4r1fMUqW2X543AUgFLhy2KKMPY99xpFgh9a7j0iCbSGyUu%2FhcRm5sw9%2Byfo34lVYneA5vA2gWX64IClLcc%2BmqdsRIvJzWstJ7Gf9LWqChvSgk4TxhhcNFKSTQrInFCB0%2BcRObJl16iGdl2cvXtuMkagAFiwxYhfIeh8c9AHBE0Y5zfw734nTtPkO5bDo%2FA2%2FzSAGaGxgFJ4C%2FTZdV1qnTGmCBTmVkL%2FA%2BSV6Jww0%2BT3pdzrmkoqZglATHuvKAR2xot5vzWBBDOYwvutoJMkNiP4YdKuAEe8VSqSZ4XZq2aV4OUI6n9UBY%2FSVBoz4WY8lHcLiAA&sl=uh4ZJGD3SDh&u=986d4e6b89f6466087ef4bb968fdbc1f&x-oss-access-key-id=STS.NTpyPVTpS3GtFQPAzDA1FYFuH&x-oss-expires=1717422695&x-oss-signature=uFQg0hj%2FnWkjGQA1Bt6ilV144o1V6xzTJ8wNKkw12cw%3D&x-oss-signature-version=OSS2
      // `)
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
              moreVideoAttr: {
                // @ts-ignore
                "webkit-playsinline": true,
                playsInline: true,
                crossOrigin: 'anonymous',
              },
              type: (data.name || '').split(".").pop() ?? "",
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
              }
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