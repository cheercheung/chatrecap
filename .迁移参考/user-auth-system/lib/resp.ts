/**
 * API响应工具函数
 */

/**
 * 成功响应
 * @param data 响应数据
 * @returns Response对象
 */
export function respData(data: any) {
  return new Response(
    JSON.stringify({
      code: 0,
      message: "success",
      data,
    }),
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
}

/**
 * 错误响应
 * @param message 错误信息
 * @param code 错误码
 * @returns Response对象
 */
export function respErr(message: string, code: number = 1) {
  return new Response(
    JSON.stringify({
      code,
      message,
      data: null,
    }),
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
}
