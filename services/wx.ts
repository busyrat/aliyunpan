'use server'

import axios from "axios"

export const sendMessage = async (message: string) => {  
  const res = await axios.post('https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=f84fd8d1-3b53-4a1f-bd64-0f06f0e708fe', {
    "msgtype": "text",
    "text": {
      "content": `阿里云盘订阅消息：\n${message}`
    }
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  console.log(res.data)
}
