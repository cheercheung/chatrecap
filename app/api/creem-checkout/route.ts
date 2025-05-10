import { createCreemCheckout } from "@/services/creem-payment";
import { respData, respErr } from "@/lib/resp";

export async function POST(req: Request) {
  try {
    const { amount, product_id, user_id } = await req.json();

    if (!product_id) {
      return respErr("产品ID不能为空");
    }

    // 传递所有必要参数
    const result = await createCreemCheckout({
      amount,
      product_id, // 产品ID，用于区分不同套餐
      user_id, // 用户ID，可选参数
    });

    return respData({
      order_no: result.order_no,
      checkout_url: result.checkout_url
    });
  } catch (e: any) {
    console.error("Creem checkout failed:", e);
    return respErr("支付创建失败: " + e.message);
  }
}
