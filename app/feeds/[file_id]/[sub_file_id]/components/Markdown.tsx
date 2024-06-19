'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

import './markdown.css'
import { blobToArrayBuffer } from '@/lib/utils'

type Props = {
  file: any
}


const MarkdownPreview: React.FC<Props> = ({ file }) => {
  const [text, setText] = useState<string>('')
  useEffect(() => {
    if (!file.link.url) return
    async function run () {
      const resp = await axios.get(file.link.url, {
        responseType: "blob",
        params: false
          ? {
              alist_ts: new Date().getTime(),
            }
          : undefined,
      })
      const content = await blobToArrayBuffer(resp.data)
      const textDecoder = new TextDecoder('utf-8')
      let text = textDecoder.decode(content)
      text = `# ${file.name}\n${text}`
      
      setText(text)
    }
    run ()
  }, [file.link.url, file.name])
  
  if (!text) return 'loading...'

  return (
    <Markdown
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
  )
}

export default MarkdownPreview