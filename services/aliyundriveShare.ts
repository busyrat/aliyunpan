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
  private token: string = ''
  
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
    const res = await axios.post(url, refreshParams);
    this.token = res.data.share_token
  }
  
  private async handleRequest(config: AdaptAxiosRequestConfig): Promise<AdaptAxiosRequestConfig> {
    if (!this.token) {
      const { share_id, share_pwd } = config.data
      await this.refreshToken({ share_id, share_pwd });
    }
    
    config.headers['X-Share-Token'] = this.token

    return config
  }

  private handleRequestError(error: any) {
    return Promise.reject(error)
  }

  private async handleResponseError(error: any): Promise<any> {
    const originalRequestConfig = error.config;
    if (!error.response) return Promise.reject(error);

    const { status } = error.response;

    if (status === 401 && !originalRequestConfig._retry) {
      originalRequestConfig._retry = true;
      const { share_id, share_pwd } = originalRequestConfig.data
      await this.refreshToken({ share_id, share_pwd });

      originalRequestConfig.headers['X-Share-Token'] = this.token

      return this.api(originalRequestConfig);
    }

    if ([429, 502, 504].includes(status) && originalRequestConfig._retryCount < 5) {
      await delay(10 * 1000)
      originalRequestConfig._retryCount = (originalRequestConfig._retryCount || 0) + 1
      return this.api(originalRequestConfig);
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

export const r = new BaseRequest('https://api.aliyundrive.com')

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

// export async function getList ({ share_id, file_id }: {
//   share_id: string,
//   file_id: string,
// }) {
//   const body = {
//     share_id,
//     parent_file_id: file_id,
//     limit: 1,
//     order_by: "name",
//     marker: ''
//   }
//   let items: File[] = []

//   do {
//     const res = await r.post<any>('/adrive/v2/file/list_by_share', body)
//     items = items.concat(res.items)
//     body.marker = res.next_marker    
//   } while (body.marker);

//   return items;
// }

// export async function *getList ({ share_id, file_id, marker }: {
//   share_id: string,
//   file_id: string,
//   marker?: string,
// }): AsyncGenerator<any[]> {
//   const body = {
//     limit: 1,
//     order_by: "name",
//   }
//   let items: File[] = []

//   const res = await r.post<any>('/adrive/v2/file/list_by_share', { share_id, parent_file_id: file_id, marker, ...body })
//   yield res.items

//   if (res.next_marker) {
//     yield *getList({ share_id, file_id, marker: res.next_marker })
//   }
// }

// export async function getList ({ share_id, file_id }: {
//   share_id: string,
//   file_id: string,
// }): Promise<any> {
//   async function *fetchData({ share_id, file_id, marker }: any): AsyncGenerator<any[]> {
//     const body = {
//       limit: 1,
//       order_by: "name",
//     }
//     const res = await r.post<any>('/adrive/v2/file/list_by_share', { share_id, parent_file_id: file_id, marker, ...body })
    
//     yield res.items
//     if (res.next_marker) {
//       yield *fetchData({ share_id, file_id, marker: res.next_marker })
//     }
//   }

//   const allItems = [];
    
//   for await (const items of fetchData({ share_id, file_id })) {
//     allItems.push(...items);
//   }
//   return allItems
// }

export async function getList ({ share_id, file_id }: {
  share_id: string,
  file_id: string,
}): Promise<any[]> {
  const allItems: any[] = [];
  async function fetchData({ share_id, file_id, marker }: any): Promise<any> {
    const body = {
      limit: 1,
      order_by: "name",
    }
    const res = await r.post<any>('/adrive/v2/file/list_by_share', { share_id, parent_file_id: file_id, marker, ...body })
    
    allItems.push(...res.items);
    if (res.next_marker) {
      await fetchData({ share_id, file_id, marker: res.next_marker })
    }
  }

  await fetchData({ share_id, file_id })

  return allItems
}