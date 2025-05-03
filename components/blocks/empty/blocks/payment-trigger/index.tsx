'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PaymentTriggerProps {
  fileId: string;
  amount?: number;
  buttonText?: string;
  className?: string;
}

export function PaymentTrigger({
  fileId,
  amount = 990, // 默认金额 $9.90 (单位为分)
  buttonText = 'AI Recap',
  className = 'w-full'
}: PaymentTriggerProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (!fileId) {
      toast.error('Please upload file or paste content first');
      return;
    }

    setIsLoading(true);

    try {
      // 1. 开始进行数据处理和基础分析（异步进行，不等待完成）
      // 这个请求会在后台处理，不会阻塞支付流程
      fetch('/api/chat-processing/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId,
          skipAiAnalysis: true // 只进行基础分析，不进行AI分析
        }),
      }).catch(err => {
        console.error('Background processing failed:', err);
        // 不阻止支付流程继续
      });

      // 2. 创建支付会话
      const response = await fetch('/api/creem-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId,
          amount
        }),
      });

      const responseData = await response.json();
      console.log('Payment API response data:', responseData);

      const { success, message, data } = responseData;

      if (!success) {
        console.error('Payment session creation failed:', message);
        toast.error(message || 'Failed to create payment session');
        return;
      }

      // 3. 重定向到Creem支付页面
      window.location.href = data.checkout_url;
    } catch (error) {
      console.error('Payment request failed:', error);
      toast.error('Failed to create payment session, please try again later');

      // 支付失败时，重定向到基础分析结果页面
      window.location.href = `/chatrecapresult?fileId=${fileId}`;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading || !fileId}
      className={className}
    >
      {isLoading ? '处理中...' : buttonText}
    </Button>
  );
}
