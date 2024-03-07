'use client'
import { File } from '@/app/lib/definitionis'
import { addFeed, getList, postFeed } from '@/services/dashboard'
import { HeartOutlined } from '@ant-design/icons';
import { Tree } from 'antd';
import type { GetProps, TreeDataNode, TreeNodeProps } from 'antd';
import { BasicDataNode } from 'antd/es/tree';
import React, { ReactNode, useCallback, useEffect, useState } from 'react'

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;

const { DirectoryTree } = Tree;

import './index.css'

type FileTreeProps = {
  feedCode: string
}

function FileTreeNode(props: { node: any }) {
  const { share_id, file_id, title } = props.node

  const handleFeed = async () => {    
    await postFeed(share_id, file_id, title)
  }

  return <div className="file-tree-node inline-block">
    <span className='inline-block truncate w-64'>{String(title)}</span>
    <span className='feed-icon inline-block absolute right-2' onClick={handleFeed}>
      <HeartOutlined />
    </span>
  </div>
}

export default function FileTree(props: FileTreeProps) {  
  const [share_id, file_id] = props.feedCode.split('_')
  const [tree, setTree] = useState<any[]>([])

  useEffect(() => {
    (async () => {
      const files: File[] = await getList(share_id, file_id)
      const _tree = files.map(file => ({
        title: file.name,
        key: file.file_id,
        isLeaf: file.type === 'file',
        ...file
      }))
      setTree(_tree)
    })()
  }, [share_id, file_id])

  const onSelect: DirectoryTreeProps['onSelect'] = async (keys, info: any) => {
    const { share_id, file_id, pos } = info.node
    if (info.selectedNodes[0].children) return
    
    const files: File[] = await getList(share_id, file_id)
    const _tree = files.map(file => ({
      title: file.name,
      key: file.file_id,
      isLeaf: file.type === 'file',
      ...file
    }))
    let node = { children: tree }
    pos.split('-').slice(1).forEach((p: string) => {
      node = node.children[+p]
    });
    node.children = _tree
    setTree(tree.concat([]))
  };

  const onExpand: DirectoryTreeProps['onExpand'] = (keys, info) => {
    // console.log('Trigger Expand', keys, info);
  };

  return (
    <div className="w-1/2">
      <DirectoryTree
        defaultExpandAll
        onSelect={onSelect}
        onExpand={onExpand}
        treeData={tree}
        titleRender={(node: TreeDataNode) => <FileTreeNode node={node} />}
      />
    </div>
  )
}
