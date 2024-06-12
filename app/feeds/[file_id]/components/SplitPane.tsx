'use client'

import React from 'react'
import { Allotment } from "allotment";
import "allotment/dist/style.css";


const SplitPane = (props: any) => {
  const { children, ...rest } = props;
  return (
    <Allotment { ...rest }>
      {props.children}
    </Allotment>
  )
}

export default SplitPane