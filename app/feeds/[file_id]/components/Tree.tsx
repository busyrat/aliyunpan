'use client'
import React, { useEffect, useState } from 'react';
import { Tree } from 'antd';
import { Feed, File } from '@/app/lib/db';
import { getList } from '@/app/lib/action';
import { useRouter } from 'next/navigation';

interface DataNode {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: DataNode[];
}

type FileTreeProps = {
  file_id: string,
  feedMap: {
    [key: string]: Feed
  },
}

// It's just a simple demo. You can use tree map to optimize update perf.
const updateTreeData = (list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] =>
  list.map((node) => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });

const FilesTree: React.FC<FileTreeProps> = ({ file_id, feedMap }) => {
  const root = feedMap[file_id]
  const { share_id } = root
  const [treeData, setTreeData] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const files: File[] = await getList({ share_id, file_id })
      const _tree = files.map((file, index) => ({
        key: file.file_id,
        title: file.name,
        isLeaf: file.type !== 'folder',
        ...file
      }))
      setTreeData(_tree)
    })()
  }, [share_id, file_id])

  const onLoadData = async (record: any) => {
    const { share_id, file_id, pos } = record
    if (record.children) return
    
    const files: File[] = await getList({ share_id, file_id })
    const _tree = files.map((file, index) => ({
      key: file.file_id,
      title: file.name,
      isLeaf: file.type !== 'folder',
      ...file
    }))
    setTreeData((origin) =>
      updateTreeData(origin, record.key, _tree)
    )
  }

  const router = useRouter()
  const onSelect = (selectedKeys: React.Key[], { node }: { node: any }) => {
    router.push(`/feeds/${file_id}/${node.file_id}`)
  }

  return <Tree loadData={onLoadData} treeData={treeData} onSelect={onSelect} />
};

export default FilesTree;