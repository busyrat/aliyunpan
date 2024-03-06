"use client"
import React from 'react';
import { Tree } from 'antd';
import type { GetProps, TreeDataNode } from 'antd';
import { useRouter } from 'next/navigation';

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;

const { DirectoryTree } = Tree;

const FeedsTree = ({ data }: { data: TreeDataNode[] }) => {
  const router = useRouter()

  const onSelect: DirectoryTreeProps['onSelect'] = (keys, info: any) => {
    const { share_id, file_id } = info.node
    let key = share_id
    if (file_id) {
      key += `_${file_id}`
    }
    router.push(`/dashboard/feed/${key}`);
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
      treeData={data}
    />
  );
};

export default FeedsTree;