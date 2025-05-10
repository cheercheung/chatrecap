/**
 * 字符计数功能测试API
 * 用于测试字符计数功能
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { countCharacters, countTotalCharactersInMessages } from '@/lib/word-counter';
import { RawMessage } from '@/lib/chat-processing/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

  // 测试结果
  const results = {
    singleString: {
      englishWithoutSpaces: countCharacters('Hello, world!', false),
      englishWithSpaces: countCharacters('Hello, world!', true),
      chineseWithoutSpaces: countCharacters('你好，世界！', false),
      emptyString: countCharacters('', false)
    },
    messageArray: {
      withoutSpaces: countTotalCharactersInMessages(testMessages, false),
      withSpaces: countTotalCharactersInMessages(testMessages, true)
    },
    expected: {
      withoutSpaces: 
        'Hello,howareyou?'.length +
        '我很好，谢谢！'.length +
        'Great!Let\'smeettomorrow.'.length,
      withSpaces: 
        'Hello, how are you?'.length +
        '我很好，谢谢！'.length +
        'Great! Let\'s meet tomorrow.'.length
    }
  };

  // 验证结果
  const validation = {
    withoutSpaces: results.messageArray.withoutSpaces === results.expected.withoutSpaces,
    withSpaces: results.messageArray.withSpaces === results.expected.withSpaces
  };

  // 返回测试结果
  res.status(200).json({
    success: true,
    testMessages,
    results,
    validation
  });
}
