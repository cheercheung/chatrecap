/**
 * 分析 Next.js 编译时间的脚本
 * 使用方法: NODE_DEBUG=next:build node scripts/analyze-build-time.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 创建临时日志文件
const logFile = path.join(__dirname, '../build-log.txt');

try {
  // 运行构建命令并将输出重定向到文件
  console.log('开始构建并记录日志...');
  execSync('NODE_DEBUG=next:build npm run build > build-log.txt 2>&1', {
    stdio: 'inherit'
  });
} catch (error) {
  console.error('构建过程中出错:', error);
}

// 分析日志文件
console.log('分析构建日志...');
try {
  const log = fs.readFileSync(logFile, 'utf8');
  
  // 提取模块编译时间
  const moduleTimeRegex = /Compiled (.+) in (\d+(?:\.\d+)?)s/g;
  const moduleMatches = [...log.matchAll(moduleTimeRegex)];
  
  // 提取路由编译时间
  const routeTimeRegex = /Compiled route (.+) in (\d+(?:\.\d+)?)s/g;
  const routeMatches = [...log.matchAll(routeTimeRegex)];
  
  // 按编译时间排序
  const sortedModules = moduleMatches
    .map(match => ({
      name: match[1],
      time: parseFloat(match[2])
    }))
    .sort((a, b) => b.time - a.time);
  
  const sortedRoutes = routeMatches
    .map(match => ({
      name: match[1],
      time: parseFloat(match[2])
    }))
    .sort((a, b) => b.time - a.time);
  
  // 输出结果
  console.log('\n===== 模块编译时间 (降序) =====');
  sortedModules.forEach((module, index) => {
    console.log(`${index + 1}. ${module.name}: ${module.time.toFixed(2)}s`);
  });
  
  console.log('\n===== 路由编译时间 (降序) =====');
  sortedRoutes.forEach((route, index) => {
    console.log(`${index + 1}. ${route.name}: ${route.time.toFixed(2)}s`);
  });
  
  // 计算总编译时间
  const totalTime = sortedModules.reduce((sum, module) => sum + module.time, 0);
  console.log(`\n总编译时间: ${totalTime.toFixed(2)}s`);
  
  // 分析慢速模块
  console.log('\n===== 编译时间超过1秒的模块 =====');
  const slowModules = sortedModules.filter(module => module.time > 1);
  slowModules.forEach((module, index) => {
    console.log(`${index + 1}. ${module.name}: ${module.time.toFixed(2)}s`);
  });
  
} catch (error) {
  console.error('分析日志时出错:', error);
}

// 清理日志文件
try {
  fs.unlinkSync(logFile);
  console.log('\n已清理临时日志文件');
} catch (error) {
  console.error('清理日志文件时出错:', error);
}
