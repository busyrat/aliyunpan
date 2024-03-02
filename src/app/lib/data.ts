import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { feed } from './definitionis';

export async function fetchFeeds() {
  noStore()

  try {
    const data = await sql<feed>`SELECT * FROM feeds`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}
