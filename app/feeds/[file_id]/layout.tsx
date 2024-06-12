import React, { Suspense } from 'react'
import { sql } from '@vercel/postgres';
import { Feed } from '@/app/lib/db';

import FilesTree from './components/Tree';
import SplitPane from './components/SplitPane';

type Props = {
  children: React.ReactNode,
  params: { 
    file_id: string,
    share_id: string,
  }
}

const FileLayout: React.FC<Props> = async ({ params, children }) => {
  
  const { file_id } = params

  const { rows } = await sql<Feed>`
    SELECT * FROM feeds
    WHERE file_id = ${file_id} OR parent_file_id = ${file_id}
  `

  const feedMap: Record<string, any> = rows.reduce((acc, cur) => ({...acc, [cur.file_id]: cur}), {})
  
  return (
    <div className="w-full h-full">
      <SplitPane defaultSizes={[300, 1000]} minSize={0} >
        <div className="h-full overflow-y-auto">
          <FilesTree file_id={params.file_id} feedMap={feedMap} />
        </div>
        <div className="h-full overflow-y-auto">
          <Suspense fallback={<p>Loading...</p>}>
            { children }
          </Suspense>
        </div>
      </SplitPane>
    </div>
  )
}

export default FileLayout
