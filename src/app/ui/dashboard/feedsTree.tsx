"use client"
import React from 'react';
import { Tree } from 'antd';
import type { GetProps, TreeDataNode } from 'antd';
import { useRouter } from 'next/navigation';

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;

const { DirectoryTree } = Tree;

const FeedsTree = ({ data }: { data: TreeDataNode[] }) => {
  const { replace } = useRouter()

  const onSelect: DirectoryTreeProps['onSelect'] = (keys, info: any) => {
    console.log('Trigger Select', keys, info);
    replace(`/dashboard/feed/${info.node.share_id}`);
  };

  const onExpand: DirectoryTreeProps['onExpand'] = (keys, info) => {
    console.log('Trigger Expand', keys, info);
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