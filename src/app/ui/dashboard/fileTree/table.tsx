'use client'
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Space, Switch, Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { File } from '@/app/lib/definitionis';
import { getList, postFeed } from '@/services/dashboard';
import { FolderOutlined, FileOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { feeds as Feed } from '@prisma/client';

type TableRowSelection<T> = TableProps<T>['rowSelection'];

interface DataType extends File {
  key: React.ReactNode;
  pos: number[],
  children?: DataType[];
}

type FileTreeProps = {
  feedCode: string,
  feeds: Feed[]
}

const App = (props: FileTreeProps) => {
  const [share_id, file_id] = props.feedCode.split('_')
  const [tree, setTree] = useState<any[]>([])

  const handleFeed = useCallback(async (file: File) => {
    const { share_id,  file_id, name, parent_file_id } = file
    await postFeed(share_id, file_id, parent_file_id, name)
  }, [])

  const columns: TableColumnsType<DataType> = useMemo(() => {
    return [
      {
        title: 'name',
        dataIndex: 'name',
        key: 'name',
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
          const isFeed = props.feeds.some((f: Feed) => f.file_id === record.file_id)
          if (isFeed) {
            return <HeartFilled style={{ color: 'red' }} />
          } else {
            return <HeartOutlined onClick={handleFeed.bind(null ,record)} />
          }
        }
      },
    ];
  }, [handleFeed, props.feeds])

  useEffect(() => {
    (async () => {
      const files: File[] = await getList(share_id, file_id)
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
    
    const files: File[] = await getList(share_id, file_id)
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

export default App;