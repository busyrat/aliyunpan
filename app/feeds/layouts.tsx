'use client'
import React, { useState } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { redirect, useRouter } from 'next/navigation';


const items =[
  {
    key: 'feed',
    label: '订阅'
  }
];

const FeedLayout= (props: { children: React.ReactNode }) => {
  const { children } = props;
  
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter()

  const handleMenu = () => {
    router.push('/feeds/all')
  }

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={10} className="m-4">
        {
          items.map((item) => (
            <div key={item.key} onClick={handleMenu}>
              <div className='flex items-center justify-center border hover:bg-sky-50 cursor-pointer'>{item.label}</div>
            </div>
          ))
        }
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={90} className="m-4">
        { children }
      </ResizablePanel>
    </ResizablePanelGroup>
  )
};

export default FeedLayout;