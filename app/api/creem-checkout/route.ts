import { createCreemCheckout } from "@/services/creem-payment";
import { respData, respErr } from "@/lib/resp";

export async function POST(req: Request) {
  try {
    const { amount, fileId, product_id } = await req.json();

    if (!fileId) {
      return respErr("文件ID不能为空");
    }

    // 传递所有必要参数
    const result = await createCreemCheckout({
      amount,
      fileId,
      product_id, // 可选参数，如果提供则使用，否则使用环境变量中的默认值
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
