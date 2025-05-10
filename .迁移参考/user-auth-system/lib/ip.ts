/**
 * 获取客户端IP地址
 * @returns 客户端IP地址
 */
export async function getClientIp(): Promise<string> {
  try {
    // 尝试从公共API获取IP地址
    const response = await fetch("https://api.ipify.org?format=json");
    if (response.ok) {
      const data = await response.json();
      return data.ip;
    }
    
    // 备用方案
    return "unknown";
  } catch (e) {
    console.error("get client ip failed:", e);
    return "unknown";
  }
}
