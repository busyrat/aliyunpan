const fs = require('fs/promises');
const axios = require("axios")

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

async function withRetry(requestFunction, maxAttempts, s, ...args) {
  let attempt = 0;
  while (attempt < maxAttempts) {
    try {
      const res = await requestFunction(...args);
      return res; // 如果请求成功，直接返回结果
    } catch (error) {
      console.error(`请求失败, 暂停${s}s`);
      await delay(1000 * s); // 等待一段时间后重试
      attempt++; // 尝试次数加一
    }
  }
  throw new Error('请求失败且已达到最大尝试次数'); // 如果尝试次数达到最大尝试次数仍然失败，则抛出错误
}

// 模拟 aligo 模块的异步函数
const aligo = {
    get_share_token: async (share_id) => {
      const url = "https://api.aliyundrive.com/v2/share_link/get_share_token";
      const data = {
        share_id,
        share_pwd: "",
      };
      const res = await axios.post(url, data);
      return res.data.share_token
    },
    get_share_file_list: async (share_token, parent_file_id) => {
      const url = "https://api.aliyundrive.com/adrive/v2/file/list_by_share";
      const data = {
        share_id,
        parent_file_id,
        limit: 100,
        order_by: "name",
        order_direction: "DESC",
      };
      const headers = {
        "X-Share-Token": share_token,
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        "X-Canary": "client=web,app=share,version=v2.3.1",
        "Sec-Fetch-Mode": "cors"
      };
      const res = await axios.post(url, data, { headers });
      return res.data.items
    }
};

async function treeShare(share_token, parent_file_id = 'root') {
    const file_list = await withRetry(aligo.get_share_file_list, 5, 10, share_token, parent_file_id);
    for (const file of file_list) {
        console.log(file.name);
        all_files.push(file);
        if (file.type === 'folder') {
            await treeShare(share_token, file.file_id);
        }
    }
}

async function toFile() {
    await fs.writeFile('aliyun.json5', JSON.stringify(all_files, null, 4));
}

async function main() {
    const share_token = await aligo.get_share_token(share_id);
    await treeShare(share_token);
    await toFile();
    console.log('finish ~');
}
const share_id = 'uh4ZJGD3SDh';
const all_files = [];
main().catch(error => console.error(error));