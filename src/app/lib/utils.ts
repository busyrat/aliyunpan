function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function withRetry(
  requestFunction: Function,
  maxAttempts: number,
  s: number,
  ...args: any[]
) {
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
  throw new Error("请求失败且已达到最大尝试次数"); // 如果尝试次数达到最大尝试次数仍然失败，则抛出错误
}

export {
  delay,
  withRetry
}