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
    // "Authorization": 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5ODZkNGU2Yjg5ZjY0NjYwODdlZjRiYjk2OGZkYmMxZiIsImN1c3RvbUpzb24iOiJ7XCJjbGllbnRJZFwiOlwiMjVkelgzdmJZcWt0Vnh5WFwiLFwiZG9tYWluSWRcIjpcImJqMjlcIixcInNjb3BlXCI6W1wiRFJJVkUuQUxMXCIsXCJTSEFSRS5BTExcIixcIkZJTEUuQUxMXCIsXCJVU0VSLkFMTFwiLFwiVklFVy5BTExcIixcIlNUT1JBR0UuQUxMXCIsXCJTVE9SQUdFRklMRS5MSVNUXCIsXCJCQVRDSFwiLFwiT0FVVEguQUxMXCIsXCJJTUFHRS5BTExcIixcIklOVklURS5BTExcIixcIkFDQ09VTlQuQUxMXCIsXCJTWU5DTUFQUElORy5MSVNUXCIsXCJTWU5DTUFQUElORy5ERUxFVEVcIl0sXCJyb2xlXCI6XCJ1c2VyXCIsXCJyZWZcIjpcImh0dHBzOi8vd3d3LmFsaXl1bmRyaXZlLmNvbS9cIixcImRldmljZV9pZFwiOlwiM2U4ZTAyYzdkMzVmNDk5ODhmZTg4NWZmNzdhMTAxMjRcIn0iLCJleHAiOjE3MTcwNjgxNTQsImlhdCI6MTcxNzA2MDg5NH0.VPmu2sAh4jY5jXHrVSOGBqa0UKJbW5eC4EEjm7TaiYWs-BpTi5zV9cyYb7_XzYboNcYkFnuhgF3qXZh2T6mpB9-cQIQ-P2fXIV5jsFbpkbCgPDtn1duwtH4D2qcYLD9NEtJKrkgyE5OKYpOH5zFFKfx-EIkGj-XLMdEPXtO2Qxo',
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

  async getPreview(file_id: string): Promise<any> {
    await this.initializePromise
    const url = 'https://api.alipan.com/v2/file/get_video_preview_play_info';
    let data = {
      category: 'live_transcoding',
      share_id: this.share_id,
      file_id,
    };
    const headers = this.generateHeaders(this.token)
    const res: any = await axios.post(url, data, { headers });
    return res.data
  }

  async getLink(file_id: string): Promise<any> {

    const res0: any = await axios.post('https://auth.alipan.com/v2/account/token', {
      refresh_token: '973b824ad34241c78ce73e30a41329cb',
      grant_type: "refresh_token"
    })

    await this.initializePromise
    const url = 'https://api.alipan.com/v2/file/get_share_link_download_url';
    let data = {
      drive_id: '',
      file_id,
      // // Only ten minutes lifetime
      expire_sec: 600,
      share_id: this.share_id,
    };
    const headers: any = this.generateHeaders(this.token)
    headers.Authorization = `${res0.data.token_type} ${res0.data.access_token}`
    
    console.log(headers);
    
    const res: any = await axios.post(url, data, { headers });
    // const res2 = await axios.get(res.data.download_url, {
    //   headers: {"Referer":"https://www.aliyundrive.com/"}
    // })

    // console.log(res2);
    
    return res.data
  }
}

export default AliyunDrive

