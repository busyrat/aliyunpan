'use client'
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { FolderOutlined, FileOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { Feed, File } from '@/app/lib/db';
import { createFeed, getList } from '@/app/lib/action';

interface DataType extends File {
  key: React.ReactNode;
  pos: number[],
  children?: DataType[];
}

type FileTreeProps = {
  file_id: string,
  feedMap: {
    [key: string]: Feed
  }
}

const FilesTable = ({ file_id, feedMap }: FileTreeProps) => {
  const root = feedMap[file_id]
  const { share_id } = root
  const [tree, setTree] = useState<any[]>([])

  const columns: TableColumnsType<DataType> = useMemo(() => {
    return [
      {
        title: 'name',
        dataIndex: 'name',
        key: 'file_name',
        ellipsis: true,
        render: (text, record) => {
          const Icon = record.type === 'folder' ? FolderOutlined : FileOutlined
          return <>
            <Icon className="mr-1" />
            { text }
          </>
        }
      },
      {
        title: 'file_id',
        dataIndex: 'file_id',
        key: 'file_id',
      },
      {
        title: '操作',
        dataIndex: 'handle',
        width: '10%',
        key: 'handle',
        render: (text, record) => {
          const isFeed = !!feedMap[record.file_id]
          
          if (isFeed) {
            return <HeartFilled style={{ color: 'red' }} />
          } else {
            return <HeartOutlined onClick={() => createFeed(record)} />
          }
        }
      },
    ];
  }, [feedMap])

  useEffect(() => {
    (async () => {
      const files: File[] = await getList({share_id, file_id})
      const _tree = files.map((file, index) => ({
        key: file.file_id,
        pos: [index],
        ...file
      }))
      setTree(_tree)
    })()
  }, [share_id, file_id])

  const onSelectHandle = useCallback(async (record: any) => {
    const { share_id, file_id, pos } = record
    if (record.children) return
    
    const files: File[] = await getList({ share_id, file_id })
    const _tree = files.map((file, index) => ({
      key: file.file_id,
      pos: pos.concat(index),
      ...file
    }))
    let node = { children: tree }
    pos.forEach((p: number) => {
      node = node.children[+p]
    });
    node.children = _tree
    setTree(tree.concat([]))
  }, [tree])

  return (
    <div className="w-full">
      <Table
        pagination={false}
        columns={columns}
        onRow={(record) => {
          return {
            onClick: onSelectHandle.bind(null, record), // 点击行
          }
        }}
        dataSource={tree}
        />
    </div>
  );
};

export default FilesTable;