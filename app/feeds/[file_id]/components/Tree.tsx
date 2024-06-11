'use client'

import React, { useEffect, useState } from 'react';
import { Tree } from 'antd';
import { Feed, File } from '@/app/lib/db';
import Preview from './Preview'
import DownloadLink from './DownloadLink'
import { getList } from '@/app/lib/action';
import { Allotment } from "allotment";
import "allotment/dist/style.css";

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

  const [selectedNode, setSelectedNode] = useState<any>({})
  const onSelect = (selectedKeys: React.Key[], { node }: { node: any }) => {
    console.log(node)
    setSelectedNode(node)
  }

  return <div className="relative h-full">
    <Allotment defaultSizes={[300, 1000]}>
      <div className="h-full overflow-y-auto">
        <Tree className="flex-1" loadData={onLoadData} treeData={treeData} onSelect={onSelect} />
      </div>
      <div className="h-full overflow-y-auto">
        <div className="flex-1 p-2">
          <DownloadLink data={selectedNode} />
          {
            selectedNode.type === "file" && ['mp4', 'mkv'].includes(selectedNode.file_extension) && <Preview data={selectedNode} />
            }
        </div>
      </div>
    </Allotment>
  </div>
};

export default FilesTree;