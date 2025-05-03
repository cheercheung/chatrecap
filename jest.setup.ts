// 全局设置 Jest
import '@testing-library/jest-dom';

// 模拟 fetch
global.fetch = jest.fn();

// 注意：MockFile 实现已移除
// 如果需要模拟 File 对象，请参考 jest.setup.backup.ts
