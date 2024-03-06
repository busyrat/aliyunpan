'use client'
import { File } from '@/app/lib/definitionis'
import { getList } from '@/services/dashboard'
import { Tree } from 'antd';
import type { GetProps, TreeDataNode } from 'antd';
import React, { useEffect, useState } from 'react'

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;

const { DirectoryTree } = Tree;

type FileTreeProps = {
  feedCode: string
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
    <DirectoryTree
      multiple
      defaultExpandAll
      onSelect={onSelect}
      onExpand={onExpand}
      treeData={tree}
    />
  )
}
