/**
 * 字符计数功能手动测试脚本
 * 用于直接测试字符计数功能
 */
import { countCharacters, countTotalCharactersInMessages } from '../lib/word-counter/index';
import { RawMessage } from '../lib/chat-processing/types';

// 测试数据
const testMessages: RawMessage[] = [
  {
    sender: 'User1',
    message: 'Hello, how are you?',
    date: new Date(),
    timestamp: Date.now().toString()
  },
  {
    sender: 'User2',
    message: '我很好，谢谢！',
    date: new Date(),
    timestamp: Date.now().toString()
  },
  {
    sender: 'User1',
    message: 'Great! Let\'s meet tomorrow.',
    date: new Date(),
    timestamp: Date.now().toString()
  }
];

// 测试字符计数函数
console.log('===== 字符计数功能测试 =====');

// 测试单个字符串
console.log('\n1. 测试单个字符串:');
console.log('英文字符串 (不计算空格):', countCharacters('Hello, world!', false));
console.log('英文字符串 (计算空格):', countCharacters('Hello, world!', true));
console.log('中文字符串 (不计算空格):', countCharacters('你好，世界！', false));
console.log('空字符串:', countCharacters('', false));

// 测试消息数组
console.log('\n2. 测试消息数组:');
console.log('测试消息:');
testMessages.forEach((msg, index) => {
  console.log(`[${index + 1}] ${msg.sender}: ${msg.message}`);
});

// 不计算空格的情况
const countWithoutSpaces = countTotalCharactersInMessages(testMessages, false);
console.log('\n不计算空格的总字符数:', countWithoutSpaces);

// 计算空格的情况
const countWithSpaces = countTotalCharactersInMessages(testMessages, true);
console.log('计算空格的总字符数:', countWithSpaces);

// 手动计算预期结果
const expectedCountWithoutSpaces =
  'Hello,howareyou?'.length +
  '我很好，谢谢！'.length +
  'Great!Let\'smeettomorrow.'.length;

const expectedCountWithSpaces =
  'Hello, how are you?'.length +
  '我很好，谢谢！'.length +
  'Great! Let\'s meet tomorrow.'.length;

console.log('\n预期结果 (不计算空格):', expectedCountWithoutSpaces);
console.log('预期结果 (计算空格):', expectedCountWithSpaces);

// 验证结果
console.log('\n验证结果:');
console.log('不计算空格: ' + (countWithoutSpaces === expectedCountWithoutSpaces ? '✓ 正确' : '✗ 错误'));
console.log('计算空格: ' + (countWithSpaces === expectedCountWithSpaces ? '✓ 正确' : '✗ 错误'));

console.log('\n===== 测试完成 =====');
