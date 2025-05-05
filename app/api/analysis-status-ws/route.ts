import { NextRequest } from 'next/server';
import { fileExists, FileType } from '@/lib/storage/index';

/**
 * WebSocket 处理函数
 * 用于实时检查分析状态
 */
export async function GET(request: NextRequest) {
  // 检查请求是否是 WebSocket 请求
  const { socket: connected } = request as any;
  if (!connected) {
    return new Response('WebSocket 连接失败', { status: 400 });
  }

  // 获取文件ID
  const fileId = request.nextUrl.searchParams.get('fileId');
  if (!fileId) {
    return new Response('缺少文件ID', { status: 400 });
  }

  // 升级到 WebSocket 连接
  const { socket } = await (request as any).socket();
  
  // 设置检查间隔（毫秒）
  const CHECK_INTERVAL = 3000;
  
  // 检查分析状态
  const checkStatus = async () => {
    try {
      // 检查结果文件是否存在
      const resultExists = await fileExists(fileId, FileType.RESULT);
      
      // 检查AI分析结果是否存在
      const aiResultExists = await fileExists(fileId, FileType.AI_RESULT);
      
      // 如果两者都存在，表示分析已完成
      const completed = resultExists && aiResultExists;
      
      // 发送状态更新
      socket.send(JSON.stringify({
        success: true,
        data: {
          fileId,
          completed,
          resultExists,
          aiResultExists,
          timestamp: new Date().toISOString()
        }
      }));
      
      // 如果分析已完成，关闭连接
      if (completed) {
        socket.close();
      }
    } catch (error) {
      // 发送错误信息
      socket.send(JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      }));
    }
  };
  
  // 立即检查一次状态
  await checkStatus();
  
  // 设置定时器，定期检查状态
  const intervalId = setInterval(checkStatus, CHECK_INTERVAL);
  
  // 监听连接关闭事件
  socket.on('close', () => {
    clearInterval(intervalId);
  });
  
  return new Response(null, {
    status: 101, // Switching Protocols
    headers: {
      'Upgrade': 'websocket',
      'Connection': 'Upgrade'
    }
  });
}
