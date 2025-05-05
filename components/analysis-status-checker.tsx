'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AnalysisStatusCheckerProps {
  fileId: string;
  redirectUrl: string;
  pollingFallback?: boolean;
}

/**
 * 分析状态检查器组件
 * 使用 WebSocket 检查分析状态，如果不支持则回退到轮询
 */
export default function AnalysisStatusChecker({
  fileId,
  redirectUrl,
  pollingFallback = true
}: AnalysisStatusCheckerProps) {
  const router = useRouter();
  const [status, setStatus] = useState<'connecting' | 'checking' | 'completed' | 'error'>('connecting');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    let ws: WebSocket | null = null;
    let pollingInterval: NodeJS.Timeout | null = null;
    
    // 尝试使用 WebSocket
    const connectWebSocket = () => {
      try {
        // 创建 WebSocket 连接
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/api/analysis-status-ws?fileId=${fileId}`;
        ws = new WebSocket(wsUrl);
        
        // 连接打开时
        ws.onopen = () => {
          setStatus('checking');
        };
        
        // 收到消息时
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.success) {
              if (data.data.completed) {
                setStatus('completed');
                // 重定向到结果页面
                router.push(redirectUrl);
              }
            } else {
              setStatus('error');
              setError(data.error || '检查分析状态失败');
              
              // 如果启用了轮询回退，则在 WebSocket 失败时使用轮询
              if (pollingFallback) {
                startPolling();
              }
            }
          } catch (error) {
            setStatus('error');
            setError('解析服务器消息失败');
            
            // 如果启用了轮询回退，则在 WebSocket 失败时使用轮询
            if (pollingFallback) {
              startPolling();
            }
          }
        };
        
        // 连接关闭时
        ws.onclose = () => {
          // 如果不是因为完成而关闭，且启用了轮询回退，则使用轮询
          if (status !== 'completed' && pollingFallback) {
            startPolling();
          }
        };
        
        // 连接错误时
        ws.onerror = () => {
          setStatus('error');
          setError('WebSocket 连接失败');
          
          // 如果启用了轮询回退，则在 WebSocket 失败时使用轮询
          if (pollingFallback) {
            startPolling();
          }
        };
      } catch (error) {
        setStatus('error');
        setError('创建 WebSocket 连接失败');
        
        // 如果启用了轮询回退，则在 WebSocket 失败时使用轮询
        if (pollingFallback) {
          startPolling();
        }
      }
    };
    
    // 使用轮询检查分析状态
    const startPolling = () => {
      // 关闭 WebSocket 连接
      if (ws) {
        ws.close();
        ws = null;
      }
      
      // 清除现有的轮询间隔
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
      
      // 设置新的轮询间隔
      pollingInterval = setInterval(() => {
        fetch(`/api/check-analysis-status?fileId=${fileId}`)
          .then(response => response.json())
          .then(data => {
            if (data.success && data.data.completed) {
              setStatus('completed');
              // 重定向到结果页面
              router.push(redirectUrl);
              
              // 清除轮询间隔
              if (pollingInterval) {
                clearInterval(pollingInterval);
                pollingInterval = null;
              }
            }
          })
          .catch(error => {
            setStatus('error');
            setError('检查分析状态失败');
          });
      }, 3000);
    };
    
    // 优先尝试使用 WebSocket
    connectWebSocket();
    
    // 清理函数
    return () => {
      // 关闭 WebSocket 连接
      if (ws) {
        ws.close();
      }
      
      // 清除轮询间隔
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [fileId, redirectUrl, pollingFallback, router, status]);
  
  // 这个组件不渲染任何内容
  return null;
}
