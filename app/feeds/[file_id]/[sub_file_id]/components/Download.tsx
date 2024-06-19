'use client'
import { copyFile } from '@/app/lib/action'
import { blobToArrayBuffer } from '@/lib/utils'
import { DownloadOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import axios, { AxiosProgressEvent } from 'axios'
import React, { useEffect } from 'react'

type Props = {
  file: any
}

const Download: React.FC<Props> = ({ file }) => {
  const [progress, setProgress] = React.useState('')
  const handleDownload = async () => {
    if (!file.link.url) return
    
    const resp = await axios.get(file.link.url, {
      responseType: "blob",
      params: false
        ? {
            alist_ts: new Date().getTime(),
          }
        : undefined,
      onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
        // 计算下载进度并更新UI
        const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        console.log(`Download progress: ${progress}%`);
        if (progress === 100) {
          setProgress('')
        } else {
          setProgress(`${progress}%`)
        }
      }
    })
    const content = await blobToArrayBuffer(resp.data)

    // 创建Blob对象
    const blob = new Blob([content], { type: 'application/octet-stream' });

    // 创建一个指向Blob对象的URL
    const url = URL.createObjectURL(blob);

    // 创建一个a元素
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;  // 设置下载的文件名

    // 将a元素添加到DOM中
    document.body.appendChild(a);

    // 触发下载
    a.click();

    // 移除a元素
    document.body.removeChild(a);

    // 释放URL对象
    URL.revokeObjectURL(url);
  }

  
  return (
    // 很奇怪 a 标签的下载链接没法重命名
    // <a href={link.url} target="_blank" download={file.name} rel="noopener noreferrer">{file.name}</a>
    // <div onClick={handleDownload}>{file.name}</div>
    <span className="text-2xl hover:text-sky-500 text-gray-500">
      <DownloadOutlined onClick={handleDownload} />
      {progress}
    </span>
  )
}

export default Download