/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')('./i18n/index.ts');

const nextConfig = {
  // 配置静态资源处理
  async rewrites() {
    return [
      // 处理图标文件，防止它们被动态路由捕获
      {
        source: '/apple-touch-icon.png',
        destination: '/images/apple-touch-icon.png',
      },
      {
        source: '/apple-touch-icon-precomposed.png',
        destination: '/images/apple-touch-icon-precomposed.png',
      },
      {
        source: '/favicon.ico',
        destination: '/images/favicon.ico',
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
