import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { File, feed } from './definitionis';

export async function fetchFeeds() {
  noStore()

  try {
    const data = await sql<feed>`SELECT * FROM feeds`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch feeds data.');
  }
}

export async function fetchFile(share_id: string, parent_file_id: string = 'root') {
  noStore()

  const pid = parent_file_id
  const sid = share_id

  try {
    const data = await sql<File>`
      SELECT * 
      FROM files
      WHERE parent_file_id = ${pid}
      AND share_id = ${sid}
      ORDER BY name ASC;
    `;
    
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch file data.');
  }
}
