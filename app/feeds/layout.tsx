import React from 'react'
import FeedLayout from './layouts'
import { headers } from 'next/headers'
import { userAgent } from 'next/server'

type Props = {
  children: React.ReactNode
}

const layout = (props: Props) => {
  const { get } = headers()
  const ua = get('user-agent') || ''
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
  
  if (isMobile) {
    return <>
      { props.children }
    </>
  }

  return (
    <FeedLayout>
      { props.children }
    </FeedLayout>
  )
}

export default layout