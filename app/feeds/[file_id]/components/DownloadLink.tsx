'use client'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import './markdown.css'

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

  const [text, setText] = useState<string>('')
  useEffect(() => {
    if (!url) return
    async function run () {
      const resp = await axios.get(url, {
        responseType: "blob",
        params: false
          ? {
              alist_ts: new Date().getTime(),
            }
          : undefined,
      })
      const content = await resp.data.arrayBuffer()
      const textDecoder = new TextDecoder('utf-8')
      let text = textDecoder.decode(content)
      text = `# ${data.title}\n${text}`
      setText(text)
    }
    run ()
  }, [url, data.title])

  return (
    <div>
      Preview
      {
        url 
        ? <>
          <a href={url} target="_blank" download={data.name} rel="noopener noreferrer">{data.title}</a>
          {
            data.file_extension === 'md' && <Markdown
              className={'markdown-body'}
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
              components={{
                code(props) {
                  const { node, className, children, ref, style, ...rest } = props
                  const match = /language-(\w+)/.exec(className || '')
                  return match ? (
                    <SyntaxHighlighter
                      PreTag="div"
                      language={match[1]}
                      {...rest}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code {...rest} className={className}>
                      {children}
                    </code>
                  )
                }
              }}
            >{ text }</Markdown>
          }
          {
            ['jpg', 'jpeg', 'png'].includes(data.file_extension) && <Image width={300} height={300} src={url} alt={data.title} />
          }
        </>
        : data.title
      }
    </div>
  )
}

export default DownloadLink