import { File } from "@/app/lib/definitionis";
import axios from "axios";

export const getFile = async (share_id: string, pid: string = 'root'): Promise<File[]> => {

  const res = await axios.get('/api/aliyundrive/file', { params: { share_id, id: pid } })

  return res.data.message;
};
