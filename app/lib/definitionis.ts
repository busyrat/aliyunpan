export type File = {
  name: string,
  drive_id: string, 
  domain_id: string, 
  file_id: string, 
  share_id: string, 
  type: 'file' | 'folder', 
  created_at: number,
  updated_at: number,
  parent_file_id: string, 
  file_extension?: string, 
  mime_type?: string, 
  mime_extension?: string, 
  size?: number,
  category?: string, 
  punish_flag?: number,
  children?: File[]
}

export type feed = {
  name: string,
  share_id: string,
  created_at?: number,
  id: string
}
