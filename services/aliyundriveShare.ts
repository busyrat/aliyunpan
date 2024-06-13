import { delay, withRetry } from "@/app/lib/utils"
import axios, { AxiosHeaders, AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders } from "axios"

interface AdaptAxiosRequestConfig extends AxiosRequestConfig {
  headers: AxiosRequestHeaders
}

interface RefreshParams {
  share_id: string,
  share_pwd?: string
}

class BaseRequest {
  private api: AxiosInstance
  private tokenMap: Record<string, string> = {}
  private bearerAuthorization: string = ''
  
  constructor(baseURL: string) {
    this.api = axios.create({
      baseURL,
      timeout: 10000,
      headers: new AxiosHeaders({
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        "X-Canary": "client=web,app=share,version=v2.3.1",
        "Sec-Fetch-Mode": "cors"
      })
    })

    this.api.interceptors.request.use(
      this.handleRequest.bind(this),
      this.handleRequestError.bind(this)
    )
    
    this.api.interceptors.response.use(
      response => response,
      this.handleResponseError.bind(this)
    );
  }

  private async refreshToken(refreshParams: RefreshParams): Promise<void> {
    const url = "https://api.aliyundrive.com/v2/share_link/get_share_token";
    if (!refreshParams.share_pwd) {
      refreshParams.share_pwd = ''
    }
    if (!refreshParams.share_id) return
    const res = await axios.post(url, refreshParams);
    this.tokenMap[refreshParams.share_id] = res.data.share_token
  }

  private async refreshAuthorization() {
    const url = 'https://auth.alipan.com/v2/account/token'
    const res = await axios.post(url, {
      refresh_token: '973b824ad34241c78ce73e30a41329cb',
      grant_type: "refresh_token"
    })
    this.bearerAuthorization = res.data.access_token
  }
  
  private async handleRequest(config: AdaptAxiosRequestConfig): Promise<AdaptAxiosRequestConfig> {
    const { share_id, share_pwd } = config.data
    if (!this.tokenMap[share_id]) {
      await this.refreshToken({ share_id, share_pwd });
    }
    config.headers['X-Share-Token'] = this.tokenMap[share_id]

    return config
  }

  private handleRequestError(error: any) {
    return Promise.reject(error)
  }

  private async handleResponseError(error: any): Promise<any> {
    const originalRequestConfig = error.config;
    if (!error.response) return Promise.reject(error);
    console.log('请求失败', error.response);

    const { status, data } = error.response;

    if (typeof originalRequestConfig.data === 'string') {
      originalRequestConfig.data = JSON.parse(originalRequestConfig.data)
    }
    const { share_id, share_pwd } = originalRequestConfig.data

    if (data.code === 'ShareLinkTokenInvalid') {
      await this.refreshToken({ share_id, share_pwd });      
      originalRequestConfig.headers['X-Share-Token'] = this.tokenMap[share_id]
      return await this.api(originalRequestConfig);
    }

    if (data.code === 'AccessTokenInvalid') {
      await this.refreshAuthorization()
      originalRequestConfig.headers['Authorization'] = `Bearer ${this.bearerAuthorization}`

      return await this.api(originalRequestConfig);
    }

    const { _retryCount = 0 } = originalRequestConfig
    if (
      [429, 502, 504].includes(status) 
      && _retryCount < 5
    ) {
      console.log(`[${status}] Retrying request...`);
      await delay(10 * 1000)
      originalRequestConfig._retryCount = _retryCount + 1
      return await this.api(originalRequestConfig);
    }

    return Promise.reject(error);
  }

  public async get<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const response = await this.api.get<T>(endpoint, { params });
    return response.data;
  }

  public async post<T>(endpoint: string, data: Record<string, any> = {}): Promise<T> {
    const response = await this.api.post<T>(endpoint, data);
    return response.data;
  }
}

const r = new BaseRequest('https://api.aliyundrive.com')

// ?share_id=uh4ZJGD3SDh&file_id=621058f226c37b2560d94d44903413c0e79f61e1

export const getFile = async ({ share_id, file_id }: {
  share_id: string,
  file_id: string
}) => {
  const res = await r.post<any>('/adrive/v2/file/get_by_share', {
    share_id,
    file_id,
    drive_id: '',
    fields: '*'
  })

  return res
}

export const getList = async ({ share_id, file_id }: {
  share_id: string,
  file_id: string,
}) => {
  async function* fetchData () {
    const body = {
      share_id,
      parent_file_id: file_id,
      limit: 200,
      order_by: "name",
      marker: '_begin_marker_'
    }
  
    while (body.marker) {
      if (body.marker === '_begin_marker_') body.marker = ''
      const res = await r.post<any>('/adrive/v2/file/list_by_share', body)
      yield res.items
      body.marker = res.next_marker
    }
  }

  // 使用生成器进行异步数据获取，并转换为数组，node>=22 可使用 Array.fromAsync
  // const allItems = (await Array.fromAsync(fetchData())).flat()
  const allItems = [];
  for await (const items of fetchData()) {
    allItems.push(...items);
  }

  return allItems;
}

export const getLink = async ({ share_id, file_id }: {
  share_id: string,
  file_id: string
}) => {
  const url = '/v2/file/get_share_link_download_url';
  const res = await r.post<any>(url, {
    drive_id: '',
    share_id,
    file_id,
    // Only ten minutes lifetime
    expire_sec: 600,
  })

  return res
}

export const getLinkVideoPreview = async ({ share_id, file_id }: {
  share_id: string,
  file_id: string
}) => {
  const url = '/v2/file/get_share_link_video_preview_play_info';
  const res = await r.post<any>(url, {
    drive_id: '',
    file_id,
    share_id,
    category: 'live_transcoding',
    get_preview_url: true,
    get_subtitle_info: true,
    mode: 'high_res',
    template_id: '',
    url_expire_sec: 600
  })
  return res
}

export const copyFile = async ({ share_id, file_id }: {
  share_id: string,
  file_id: string
}) => {
  const url = '/v2/file/copy'
  const res = await r.post<any>(url, {
    share_id,
    file_id,
    to_parent_file_id: '664c474e237b9f3f31054b7dada9b43142ab3aff',
    to_drive_id: '658827872',
    auto_rename: true
    // new_name: '123'
  })
  return res
}

export const getLink2 = async ({ file_id }: {
  file_id: string
}) => {
  const url = '/v2/file/get_download_url';
  const res = await r.post<any>(url, {
    drive_id: '658827872',
    file_id,
    expire_sec: 14400,
  })

  return res
}