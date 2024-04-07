import { PrismaClient, feeds, files } from '@prisma/client';
const prisma = new PrismaClient()

export default prisma

export interface Feed extends feeds {
  file_id: string,
  share_id: string,
  name: string,
  parent_file_id: string,
}

export type FeedCreate = Pick<Feed, "name" | "share_id" | "file_id" | "parent_file_id">

export interface File extends files {
  share_id: string,
  parent_file_id: string,
  name: string,
}

export type FileMap = {
  [key: string]: File
}