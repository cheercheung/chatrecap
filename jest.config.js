const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // 指向 Next.js 应用的路径
  dir: './',
});

// Jest 配置
const customJestConfig = {
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
    },
  },
};

// 创建并导出 Next.js 的 Jest 配置
module.exports = createJestConfig(customJestConfig);
