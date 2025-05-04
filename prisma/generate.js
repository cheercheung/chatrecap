// 这个脚本用于在构建过程中生成Prisma客户端
const { execSync } = require('child_process');

try {
  console.log('开始生成Prisma客户端...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma客户端生成成功！');
} catch (error) {
  console.error('Prisma客户端生成失败:', error);
  process.exit(1);
}
