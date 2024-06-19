import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { remark } from 'remark';
import html from 'remark-html';

import './markdown.css'
import { blobToArrayBuffer } from '@/lib/utils'

type Props = {
  file: any
}


const MarkdownPreview: React.FC<Props> = async ({ file }) => {
  const resp = await axios.get(file.link.url, {
    // nodejs没用
    responseType: 'blob',
  })
  
  // IOS 兼容
  // const content = await blobToArrayBuffer(resp.data)

  // ONLY 浏览器
  // const content = await resp.data.arrayBuffer()
  // const textDecoder = new TextDecoder('utf-8')
  // let text = textDecoder.decode(content)

  let text = resp.data
  text = `# ${file.name}\n${text}`

  const processedContent = await remark()
    .use(html)
    .use(remarkGfm)
    .process(text);
  const contentHtml = processedContent.toString();


  return <div className='markdown-body' dangerouslySetInnerHTML={{ __html: contentHtml }} />
}

export default MarkdownPreview