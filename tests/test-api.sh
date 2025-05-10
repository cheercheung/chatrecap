#!/bin/bash

# 测试文件上传API
echo "测试文件上传API..."
echo "创建测试文件..."
echo "This is a test file for API testing." > test-data.txt

# 上传文件
echo "上传文件..."
UPLOAD_RESPONSE=$(curl -s -X POST -F "file=@test-data.txt" -F "platform=discord" http://localhost:3000/api/chat-processing/upload)
echo "上传响应: $UPLOAD_RESPONSE"

# 提取fileId
FILE_ID=$(echo $UPLOAD_RESPONSE | grep -o '"fileId":"[^"]*"' | cut -d'"' -f4)
echo "文件ID: $FILE_ID"

if [ -z "$FILE_ID" ]; then
  echo "文件上传失败，无法继续测试"
  exit 1
fi

# 等待2秒
echo "等待2秒..."
sleep 2

# 测试文件状态查询API
echo "测试文件状态查询API..."
STATUS_RESPONSE=$(curl -s http://localhost:3000/api/chat-processing/status/$FILE_ID)
echo "状态查询响应: $STATUS_RESPONSE"

# 测试文件处理API
echo "测试文件处理API..."
PROCESS_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d "{\"fileId\":\"$FILE_ID\",\"platform\":\"discord\"}" http://localhost:3000/api/chat-processing/process)
echo "处理响应: $PROCESS_RESPONSE"

# 等待2秒
echo "等待2秒..."
sleep 2

# 再次测试文件状态查询API
echo "再次测试文件状态查询API..."
STATUS_RESPONSE=$(curl -s http://localhost:3000/api/chat-processing/status/$FILE_ID)
echo "状态查询响应: $STATUS_RESPONSE"

# 测试平台特定处理API
echo "测试Discord处理API..."
DISCORD_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d "{\"fileId\":\"$FILE_ID\"}" http://localhost:3000/api/chat-processing/discord)
echo "Discord处理响应: $DISCORD_RESPONSE"

# 等待2秒
echo "等待2秒..."
sleep 2

# 最后测试文件状态查询API
echo "最后测试文件状态查询API..."
STATUS_RESPONSE=$(curl -s http://localhost:3000/api/chat-processing/status/$FILE_ID)
echo "状态查询响应: $STATUS_RESPONSE"

# 清理测试文件
echo "清理测试文件..."
rm test-data.txt

echo "所有测试完成"
