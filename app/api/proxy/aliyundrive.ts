import { withRetry } from "@/app/lib/utils";
import axios from "axios";

class AliyunDrive {
  private token: string
  private initializePromise: Promise<void>

  constructor(public share_id: string) {
    this.token = ''
    this.initializePromise = this.initialize()
  }

  async initialize() {
    this.token = await this.getToken()
  }

  private generateHeaders = (token: string) => ({
    "X-Share-Token": token,
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "X-Canary": "client=web,app=share,version=v2.3.1",
    "Sec-Fetch-Mode": "cors"
  })

  async getToken() {
    const url = "https://api.aliyundrive.com/v2/share_link/get_share_token";
    const data = {
      share_id: this.share_id,
      share_pwd: "",
    };
    const res = await axios.post(url, data);

    return res.data.share_token;
  }

  async getFile(file_id: string): Promise<any> {
    await this.initializePromise
    const url = "https://api.aliyundrive.com/adrive/v2/file/get_by_share";
    const data = {
      share_id: this.share_id,
      file_id,
      drive_id: '',
      fields: '*'
    };
  
    const headers = this.generateHeaders(this.token)
  
    try {
      const res = await axios.post(url, data, { headers });
      return res.data
    } catch (error: any) {
      await this.getToken()
      return await this.getFile(file_id)
    }
  }

  async getList(pid: string = 'root'): Promise<any> {
    await this.initializePromise
    const url = "https://api.aliyundrive.com/adrive/v2/file/list_by_share";
    const data = {
      share_id: this.share_id,
      parent_file_id: pid,
      limit: 200,
      order_by: "name"
    };
  
    const headers = this.generateHeaders(this.token)
  
    let marker
    let items: File[] = []
  
    const post = withRetry.bind(null, axios.post, 5, 10)
    do {
      const res: any = await post(url, { ...data, marker }, { headers });
      items = items.concat(res.data.items)
      marker = res.data.next_marker
    } while (marker);
  
    return items;
  }
}

export default AliyunDrive

