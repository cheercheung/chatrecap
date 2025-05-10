#!/bin/bash

# 测试不同平台的文件处理API

# 测试文件上传和处理
test_platform() {
  local file_path=$1
  local platform=$2
  
  echo "===== 测试 $platform 平台 ====="
  echo "上传文件: $file_path"
  
  # 上传文件
  UPLOAD_RESPONSE=$(curl -s -X POST -F "file=@$file_path" -F "platform=$platform" http://localhost:3000/api/chat-processing/upload)
  echo "上传响应: $UPLOAD_RESPONSE"
  
  # 提取fileId
  FILE_ID=$(echo $UPLOAD_RESPONSE | grep -o '"fileId":"[^"]*"' | cut -d'"' -f4)
  
  if [ -z "$FILE_ID" ]; then
    echo "文件上传失败，无法继续测试"
    return 1
  fi
  
  echo "文件ID: $FILE_ID"
  
  # 等待2秒
  echo "等待2秒..."
  sleep 2
  
  # 测试文件状态查询API
  echo "测试文件状态查询API..."
  STATUS_RESPONSE=$(curl -s http://localhost:3000/api/chat-processing/status/$FILE_ID)
  echo "状态查询响应: $STATUS_RESPONSE"
  
  # 测试文件处理API
  echo "测试文件处理API..."
  PROCESS_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d "{\"fileId\":\"$FILE_ID\",\"platform\":\"$platform\"}" http://localhost:3000/api/chat-processing/process)
  echo "处理响应: $PROCESS_RESPONSE"
  
  # 等待2秒
  echo "等待2秒..."
  sleep 2
  
  # 再次测试文件状态查询API
  echo "再次测试文件状态查询API..."
  STATUS_RESPONSE=$(curl -s http://localhost:3000/api/chat-processing/status/$FILE_ID)
  echo "状态查询响应: $STATUS_RESPONSE"
  
  # 测试平台特定处理API
  echo "测试${platform}处理API..."
  PLATFORM_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d "{\"fileId\":\"$FILE_ID\"}" http://localhost:3000/api/chat-processing/$platform)
  echo "${platform}处理响应: $PLATFORM_RESPONSE"
  
  # 等待2秒
  echo "等待2秒..."
  sleep 2
  
  # 最后测试文件状态查询API
  echo "最后测试文件状态查询API..."
  STATUS_RESPONSE=$(curl -s http://localhost:3000/api/chat-processing/status/$FILE_ID)
  echo "状态查询响应: $STATUS_RESPONSE"
  
  echo "===== $platform 平台测试完成 ====="
  echo ""
  
  return 0
}

# 测试所有平台
test_all_platforms() {
  # 测试Discord平台
  test_platform "tests/discord.json" "discord"
  
  # 测试Instagram平台
  test_platform "tests/ig.json" "instagram"
  
  # 测试Snapchat平台
  test_platform "tests/snap.json" "snapchat"
  
  # 测试Telegram平台
  test_platform "tests/telegram.json" "telegram"
  
  # 测试WhatsApp平台
  test_platform "tests/whatsapp.txt" "whatsapp"
}

# 测试单个平台
test_single_platform() {
  local platform=$1
  local file_path=""
  
  case $platform in
    discord)
      file_path="tests/discord.json"
      ;;
    instagram)
      file_path="tests/ig.json"
      ;;
    snapchat)
      file_path="tests/snap.json"
      ;;
    telegram)
      file_path="tests/telegram.json"
      ;;
    whatsapp)
      file_path="tests/whatsapp.txt"
      ;;
    *)
      echo "不支持的平台: $platform"
      exit 1
      ;;
  esac
  
  test_platform "$file_path" "$platform"
}

# 主函数
main() {
  if [ $# -eq 0 ]; then
    # 如果没有参数，测试所有平台
    test_all_platforms
  else
    # 如果有参数，测试指定平台
    test_single_platform $1
  fi
  
  echo "所有测试完成"
}

# 执行主函数
main $@
