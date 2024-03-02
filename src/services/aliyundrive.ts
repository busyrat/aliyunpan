import { File } from "@/app/lib/definitionis";
import axios from "axios";

export const getToken = async (share_id: string): Promise<string> => {
  const url = "https://api.aliyundrive.com/v2/share_link/get_share_token";
  const data = {
    share_id,
    share_pwd: "",
  };
  const res = await axios.post(url, data);

  return res.data.share_token;
};

export const getList = async (share_id: string, token: string, pid: string = 'root'): Promise<File[]> => {
  const url = "https://api.aliyundrive.com/adrive/v2/file/list_by_share";
  const data = {
    share_id,
    parent_file_id: pid,
    limit: 100,
    order_by: "name",
    order_direction: "DESC",
  };

  const headers = {
    "X-Share-Token": token,
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "X-Canary": "client=web,app=share,version=v2.3.1",
    "Sec-Fetch-Mode": "cors"
  };
  
  const res = await axios.post(url, data, { headers });

  return res.data.items;
};
