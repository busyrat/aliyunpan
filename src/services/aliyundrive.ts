import { File } from "@/app/lib/definitionis";
import { withRetry } from "@/app/lib/utils";
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
    limit: 200,
    order_by: "name"
  };

  const headers = {
    "X-Share-Token": token,
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "X-Canary": "client=web,app=share,version=v2.3.1",
    "Sec-Fetch-Mode": "cors"
  };

  let marker
  let items: File[] = []

  const post = withRetry.bind(null, axios.post, 5, 10)
  do {
    const res: any = await post(url, { ...data, marker }, { headers });
    items = items.concat(res.data.items)
    marker = res.data.next_marker
  } while (marker);

  return items;
};
