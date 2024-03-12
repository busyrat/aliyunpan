import { sql } from "@vercel/postgres"
import axios from "axios"
import prisma from "@/app/lib/db";
import _ from "lodash";
import { getList as getListAliyundrive, getToken } from "@/services/aliyundrive";

export const getFile = async (share_id: string, file_id: string) => {
  let res
  try {
    const res = await axios.get('/api/aliyundrive/file', { params: { share_id, file_id } })
    return res.data.message
  } catch (error) {
    console.log(error);
    
    return []
  }
}

export const getList = async (share_id: string, file_id: string) => {
  let res
  try {
    const res = await axios.get('/api/aliyundrive/list', { params: { share_id, file_id } })
    return res.data.message
  } catch (error) {
    console.log(error);
    
    return []
  }
}

export const postFeed = async (share_id: string, file_id: string, parent_file_id: string, name: string) => {
  let res
  try {
    const res = await axios.post('/api/feed', { share_id, file_id, parent_file_id, name })
    return res.data.message
  } catch (error) {
    console.log(error);
    
    return []
  }
}

export const getFeed = async (share_id: string, file_id: string) => {  
  const { rows } = await sql`
    SELECT * FROM feeds
    WHERE share_id = ${share_id}
    AND file_id = ${file_id}
  `
  return rows
}

export const addFeed = async (share_id: string, file_id: string, parent_file_id: string, name: string) => {  
  const list = await getListAliyundrive(share_id, file_id);
  
  try {
    await prisma.files.createMany({
      data: list.map((file: any) => _.pick(file, ['name', 'drive_id', 'domain_id', 'file_id', 'share_id', 'type', 'created_at', 'updated_at', 'parent_file_id', 'file_extension', 'mime_type', 'mime_extension', 'size', 'category', 'punish_flag'])),
      skipDuplicates: true
    })    
  } catch (error) {
    console.log('insert file failed!', error, list);
  }

  const r = await sql`
    INSERT INTO feeds (name, share_id, file_id, parent_file_id)
    VALUES (${name}, ${share_id}, ${file_id}, ${parent_file_id})
    ON CONFLICT (file_id) DO NOTHING;
  `
  return r
}