// 全局设置
jest.setTimeout(30000); // 设置超时时间为30秒

// 模拟全局对象
global.fetch = jest.fn();
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
};

// 模拟 File 对象
global.File = class MockFile {
  name;
  type;
  content;

  constructor(content, name, options) {
    this.content = typeof content === 'string' ? content : (content[0] || '');
    this.name = name;
    this.type = options.type;
  }

  toString() {
    return this.content;
  }
};

// 清理模拟
afterEach(() => {
  jest.clearAllMocks();
});
