import React, { useEffect, useState } from 'react'
import Image from 'next/image'

type PreviewProps = {
  file: any
}

const ImagePreview: React.FC<PreviewProps> = ({ file }) => {
  return (
    <Image width={600} height={600} src={file.link.url} alt={file.title} />
  )
}

export default ImagePreview