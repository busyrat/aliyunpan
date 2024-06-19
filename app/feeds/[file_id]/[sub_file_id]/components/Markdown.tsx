import axios from 'axios'
import React from 'react'
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
    // nodejs中如果设置为 blob，则无效
    // https://stackoverflow.com/questions/60454048/how-does-axios-handle-blob-vs-arraybuffer-as-responsetype
    responseType: 'arraybuffer',
  })
  
  // 如果 responseType = blob 就需要转义一次
  // const content = await resp.data.arrayBuffer()
  const textDecoder = new TextDecoder('utf-8')
  let text = textDecoder.decode(resp.data)

  text = `# ${file.name}\n${text}`

  const processedContent = await remark()
    .use(html)
    .use(remarkGfm)
    // .use(rehypeRaw)
    .process(text);
  const contentHtml = processedContent.toString();


  return <div className='markdown-body' dangerouslySetInnerHTML={{ __html: contentHtml }} />
}

export default MarkdownPreview