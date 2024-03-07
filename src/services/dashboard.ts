import { sql } from "@vercel/postgres"
import axios from "axios"

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

export const postFeed = async (share_id: string, file_id: string, name: string) => {
  let res
  try {
    const res = await axios.post('/api/feed', { share_id, file_id, name })
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

export const addFeed = async (share_id: string, file_id: string, name: string) => {  
  const r = await sql`
    INSERT INTO feeds (name, share_id, file_id)
    VALUES (${name}, ${share_id}, ${file_id})
    ON CONFLICT (file_id) DO NOTHING;
  `
  return r
}