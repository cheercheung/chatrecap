import { NextRequest } from "next/server";
import { getUserInfo } from "@/services/user";
import { respData, respErr } from "@/lib/resp";

/**
 * 获取当前登录用户信息
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getUserInfo();
    
    if (!user) {
      return respErr("user not found");
    }
    
    return respData(user);
  } catch (e) {
    console.error("get user info failed:", e);
    return respErr("get user info failed");
  }
}
