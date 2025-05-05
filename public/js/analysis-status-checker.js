/**
 * 分析状态检查器客户端脚本
 * 使用 WebSocket 检查分析状态，如果不支持则回退到轮询
 */
(function() {
  // 获取分析状态检查器元素
  const checkerElement = document.getElementById('analysis-status-checker');
  if (!checkerElement) return;
  
  // 获取文件ID和重定向URL
  const fileId = checkerElement.getAttribute('data-file-id');
  const redirectUrl = checkerElement.getAttribute('data-redirect-url');
  
  if (!fileId || !redirectUrl) {
    console.error('缺少文件ID或重定向URL');
    return;
  }
  
  // 状态变量
  let status = 'connecting';
  let ws = null;
  let pollingInterval = null;
  
  // 尝试使用 WebSocket
  const connectWebSocket = () => {
    try {
      // 创建 WebSocket 连接
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/analysis-status-ws?fileId=${fileId}`;
      ws = new WebSocket(wsUrl);
      
      // 连接打开时
      ws.onopen = () => {
        status = 'checking';
        console.log('WebSocket 连接已打开，正在检查分析状态...');
      };
      
      // 收到消息时
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.success) {
            if (data.data.completed) {
              status = 'completed';
              console.log('分析已完成，正在重定向...');
              
              // 重定向到结果页面
              window.location.href = redirectUrl;
            } else {
              console.log('分析仍在进行中...');
            }
          } else {
            status = 'error';
            console.error('检查分析状态失败:', data.error);
            
            // 使用轮询作为回退
            startPolling();
          }
        } catch (error) {
          status = 'error';
          console.error('解析服务器消息失败:', error);
          
          // 使用轮询作为回退
          startPolling();
        }
      };
      
      // 连接关闭时
      ws.onclose = () => {
        // 如果不是因为完成而关闭，则使用轮询
        if (status !== 'completed') {
          console.log('WebSocket 连接已关闭，切换到轮询...');
          startPolling();
        }
      };
      
      // 连接错误时
      ws.onerror = (error) => {
        status = 'error';
        console.error('WebSocket 连接失败:', error);
        
        // 使用轮询作为回退
        startPolling();
      };
    } catch (error) {
      status = 'error';
      console.error('创建 WebSocket 连接失败:', error);
      
      // 使用轮询作为回退
      startPolling();
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
    
    console.log('开始轮询检查分析状态...');
    
    // 设置新的轮询间隔
    pollingInterval = setInterval(() => {
      fetch(`/api/check-analysis-status?fileId=${fileId}`)
        .then(response => response.json())
        .then(data => {
          if (data.success && data.data.completed) {
            status = 'completed';
            console.log('分析已完成，正在重定向...');
            
            // 重定向到结果页面
            window.location.href = redirectUrl;
            
            // 清除轮询间隔
            if (pollingInterval) {
              clearInterval(pollingInterval);
              pollingInterval = null;
            }
          } else {
            console.log('分析仍在进行中...');
          }
        })
        .catch(error => {
          console.error('检查分析状态失败:', error);
        });
    }, 3000);
  };
  
  // 优先尝试使用 WebSocket
  connectWebSocket();
  
  // 添加页面卸载事件监听器
  window.addEventListener('beforeunload', () => {
    // 关闭 WebSocket 连接
    if (ws) {
      ws.close();
    }
    
    // 清除轮询间隔
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
  });
})();
