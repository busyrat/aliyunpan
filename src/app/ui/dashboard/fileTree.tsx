'use client'
import React, { useCallback, useState } from 'react'
import './fileTree.css'
import { getFile } from '@/services/file'
import { File } from '@/app/lib/definitionis'
import { FolderOutlined, FileOutlined } from '@ant-design/icons';

function Col({ data, onClick }: { data: File[], onClick: Function }) {
  return (
    <div className="col pr-3 mr-3 border-r-2">
      {data.map(d => <div key={d.file_id} title={d.name} onClick={onClick.bind(null, d)}>
        { 
          d.type === 'folder'
          ? <FolderOutlined className="mr-1" />
          : <FileOutlined className="mr-1" />
        }
        {d.name}
      </div> )}
    </div>
  )
}

export default function FileTree({ treeData }: { treeData: File[][] }) {
  const [cols, setCols] = useState(treeData)

  const handleItem = useCallback(async (index: number, file: File) => {
    if (file.type !== 'folder') return
    const list = await getFile(file.share_id, file.file_id)
    cols[index + 1] = list
    cols.length = index + 2
    setCols(cols.concat([]))
  }, [cols])

  return (
    <div className="flex">
      {
        cols.map((col, index) => <Col key={index} data={col} onClick={handleItem.bind(null, index)} />)
      }
    </div>
  )
}
