import { NextRequest } from "next/server";
import { updateInviteRelation } from "@/services/user";
import { respData, respErr } from "@/lib/resp";

/**
 * 更新用户邀请关系
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { invite_code, user_uuid } = body;
    
    if (!invite_code || !user_uuid) {
      return respErr("invalid params");
    }
    
    const user = await updateInviteRelation(user_uuid, invite_code);
    
    if (!user) {
      return respErr("update invite relation failed");
    }
    
    return respData(user);
  } catch (e: any) {
    console.error("update invite relation failed:", e);
    return respErr(e.message || "update invite relation failed");
  }
}
