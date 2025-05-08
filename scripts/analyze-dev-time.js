/**
 * 分析 Next.js 开发模式编译时间的脚本
 * 使用方法: node scripts/analyze-dev-time.js
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// 创建临时日志文件
const logFile = path.join(__dirname, '../dev-log.txt');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

console.log('启动开发服务器并记录编译时间...');
console.log('按 Ctrl+C 停止记录');

// 启动开发服务器
const devProcess = spawn('npm', ['run', 'dev'], {
  shell: true,
  stdio: ['ignore', 'pipe', 'pipe']
});

// 记录输出
devProcess.stdout.pipe(process.stdout);
devProcess.stderr.pipe(process.stderr);

devProcess.stdout.on('data', (data) => {
  logStream.write(data);
});

devProcess.stderr.on('data', (data) => {
  logStream.write(data);
});

// 处理进程结束
devProcess.on('close', (code) => {
  logStream.end();
  console.log(`\n开发服务器已停止，退出码: ${code}`);
  
  // 分析日志
  analyzeLog();
});

// 处理 Ctrl+C
process.on('SIGINT', () => {
  devProcess.kill('SIGINT');
  console.log('\n正在停止开发服务器...');
});

function analyzeLog() {
  console.log('\n分析编译日志...');
  try {
    const log = fs.readFileSync(logFile, 'utf8');
    
    // 提取编译时间
    const compileRegex = /Compiled (.+) in (\d+(?:\.\d+)?)s/g;
    const matches = [...log.matchAll(compileRegex)];
    
    // 按编译时间排序
    const sortedCompiles = matches
      .map(match => ({
        name: match[1],
        time: parseFloat(match[2])
      }))
      .sort((a, b) => b.time - a.time);
    
    // 输出结果
    console.log('\n===== 编译时间 (降序) =====');
    sortedCompiles.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name}: ${item.time.toFixed(2)}s`);
    });
    
    // 分析慢速编译
    console.log('\n===== 编译时间超过5秒的模块 =====');
    const slowCompiles = sortedCompiles.filter(item => item.time > 5);
    slowCompiles.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name}: ${item.time.toFixed(2)}s`);
    });
    
    // 清理日志文件
    fs.unlinkSync(logFile);
    console.log('\n已清理临时日志文件');
    
  } catch (error) {
    console.error('分析日志时出错:', error);
  }
}
