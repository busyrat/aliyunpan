'use client'

import React, { useRef } from 'react'
import { Allotment } from "allotment";
import "allotment/dist/style.css";

interface SplitPaneComponentRef {
  resize: (sizes: number[]) => void;
}


const SplitPane = (props: any) => {
  const { children, ...rest } = props;
  const ref = useRef<SplitPaneComponentRef>();
  const [size, setSize] = React.useState([300, 1000]);

  const onChange = (...params: any) => {
    setSize(params[0])
    if (rest.onChange) {
      rest.onChange(...params);
    }
  }

  return (
    <>
      <button
        onClick={() => {
          if (ref.current) {
            if (size[0] === 0) {
              ref.current.resize([1000, 0]);
            } else {
              ref.current.resize([0, 1000]);
            }
          }
        }}
      >
        { size[0] === 0 ? '全文' : '目录'}
      </button>
      <Allotment { ...rest } ref={ref} onChange={onChange}>
        {props.children}
      </Allotment>
    </>
  )
}

export default SplitPane