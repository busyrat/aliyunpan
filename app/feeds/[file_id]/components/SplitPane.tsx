'use client'

import React, { useRef } from 'react'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

interface SplitPaneComponentRef {
  setLayout: (sizes: number[]) => void;
}


const SplitPane = (props: any) => {
  const { children, ...rest } = props;
  const ref = useRef<SplitPaneComponentRef>();
  const [size, setSize] = React.useState([30, 70]);

  const onChange = (...params: any) => {
    setSize(params[0])
    if (rest.onChange) {
      rest.onChange(...params);
    }
  }

  return (
    <>
      <ResizablePanelGroup direction="horizontal" ref={ref} onLayout={onChange} className="relative">
        <ResizablePanel defaultSize={size[0]}>
          { children[0] }
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={size[1]}>
          { children[1] }
        </ResizablePanel>
        <button
          className="absolute right-0 top-0"
          onClick={() => {
            if (ref.current) {
              if (size[0] === 0) {
                ref.current.setLayout([100, 0]);
              } else {
                ref.current.setLayout([0, 100]);
              }
            }
          }}
        >
          { size[0] === 0 ? '目录' : '全文'}
        </button>
      </ResizablePanelGroup> 
    </>
  )
}

export default SplitPane