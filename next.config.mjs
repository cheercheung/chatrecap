import bundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";
import mdx from "@next/mdx";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// 使用与next.config.js相同的配置路径
const withNextIntl = createNextIntlPlugin('./i18n/index.ts');

const withMDX = mdx({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: false,
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  async redirects() {
    return [];
  },
  // 配置静态资源处理，从next.config.js合并过来
  async rewrites() {
    return [
      // 处理图标文件，防止它们被动态路由捕获
      {
        source: '/favicon-16x16.png',
        destination: '/images/favicon-16x16.png',
      },
      {
        source: '/favicon-32x32.png',
        destination: '/images/favicon-32x32.png',
      },
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
      {
        source: '/site.webmanifest',
        destination: '/images/site.webmanifest',
      },
    ];
  },
};

// Make sure experimental mdx flag is enabled
const configWithMDX = {
  ...nextConfig,
  experimental: {
    mdxRs: true,
  },
};

export default withBundleAnalyzer(withNextIntl(withMDX(configWithMDX)));
