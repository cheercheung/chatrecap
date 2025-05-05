/**
 * i18n键检测工具
 *
 * 这个脚本帮助您：
 * 1. 扫描代码中使用的所有i18n键
 * 2. 检查这些键是否存在于翻译文件中
 * 3. 生成不匹配键的报告
 * 4. 检测键名不匹配问题
 * 5. 提供可能的修复建议
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 配置
const config = {
  // 源语言（基准语言）
  sourceLanguage: 'en',
  // 翻译文件路径
  translationPaths: [
    {
      name: 'messages',
      path: 'i18n/messages'
    },
    {
      name: 'landing',
      path: 'i18n/pages/landing'
    }
  ],
  // 需要扫描的代码文件
  codePatterns: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'utils/**/*.{js,jsx,ts,tsx}',
    'services/**/*.{js,jsx,ts,tsx}'
  ],
  // 翻译函数名
  translationFunctions: [
    't',
    'useTranslations',
    'getTranslations'
  ]
};

// 读取JSON文件
function readJsonFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

// 递归获取对象中的所有键
function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const newPrefix = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = [...keys, ...getAllKeys(obj[key], newPrefix)];
    } else {
      keys.push(newPrefix);
    }
  }
  return keys;
}

// 根据路径获取对象中的值
function getValueByPath(obj, path) {
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === undefined || current === null) {
      return undefined;
    }
    current = current[part];
  }
  return current;
}

// 扫描代码文件中的翻译键
function scanCodeForTranslationKeys() {
  const allKeys = new Set();
  const keysByFile = {};

  // 获取所有匹配的文件
  const files = [];
  config.codePatterns.forEach(pattern => {
    const matches = glob.sync(pattern);
    files.push(...matches);
  });

  // 扫描每个文件
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const keys = extractTranslationKeys(content);

    if (keys.length > 0) {
      keysByFile[file] = keys;
      keys.forEach(key => allKeys.add(key));
    }
  });

  return {
    allKeys: Array.from(allKeys),
    keysByFile
  };
}

// 从代码内容中提取翻译键
function extractTranslationKeys(content) {
  const keys = [];

  // 匹配翻译函数调用
  // 例如: useTranslations('namespace'), t('key'), getTranslations('namespace')
  const namespaceRegex = new RegExp(`(${config.translationFunctions.join('|')})\\s*\\(\\s*['"]([^'"]+)['"]\\s*\\)`, 'g');
  let match;
  while ((match = namespaceRegex.exec(content)) !== null) {
    const namespace = match[2];
    keys.push(namespace);
  }

  // 匹配翻译键调用
  // 例如: t('namespace.key'), translator('key')
  const keyRegex = /(?:t|translator)\s*\(\s*['"]([^'"]+)['"]\s*(?:,|\))/g;
  while ((match = keyRegex.exec(content)) !== null) {
    const key = match[1];
    keys.push(key);
  }

  // 匹配组件中的i18nKey属性
  // 例如: i18nKey="namespace.key"
  const i18nKeyRegex = /i18nKey\s*=\s*['"]([^'"]+)['"]/g;
  while ((match = i18nKeyRegex.exec(content)) !== null) {
    const key = match[1];
    keys.push(key);
  }

  return keys;
}

// 检查翻译键是否存在于翻译文件中
function checkTranslationKeys(keys) {
  const report = {
    missing: {},
    total: keys.length,
    missingCount: 0,
    suggestions: {}, // 添加建议字段
    duplicates: {}   // 添加重复键字段
  };

  // 加载所有翻译文件
  const translations = {};
  config.translationPaths.forEach(({ name, path: dirPath }) => {
    const filePath = `${dirPath}/${config.sourceLanguage}.json`;
    const data = readJsonFile(filePath);
    if (data) {
      translations[name] = data;
    }
  });

  // 获取所有可用的翻译键
  const allAvailableKeys = {};
  for (const [name, data] of Object.entries(translations)) {
    const keys = getAllKeys(data);
    keys.forEach(key => {
      allAvailableKeys[key] = true;
    });
  }

  // 检查每个键
  keys.forEach(key => {
    let found = false;

    // 检查是否是命名空间
    if (!key.includes('.')) {
      // 这可能是一个命名空间，跳过检查
      found = true;
    } else {
      // 尝试在每个翻译文件中查找键
      for (const [name, data] of Object.entries(translations)) {
        // 首先检查完整键
        if (getValueByPath(data, key) !== undefined) {
          found = true;
          break;
        }

        // 然后检查键的第一部分是否匹配命名空间
        const parts = key.split('.');
        const namespace = parts[0];
        const restKey = parts.slice(1).join('.');

        if (data[namespace] && getValueByPath(data[namespace], restKey) !== undefined) {
          found = true;
          break;
        }
      }
    }

    if (!found) {
      report.missingCount++;
      report.missing[key] = true;

      // 尝试找到相似的键作为建议
      const suggestions = findSimilarKeys(key, Object.keys(allAvailableKeys));
      if (suggestions.length > 0) {
        report.suggestions[key] = suggestions;
      }

      // 检查是否有重复的键（不同路径）
      const lastPart = key.split('.').pop();
      if (lastPart) {
        const possibleDuplicates = Object.keys(allAvailableKeys).filter(k =>
          k.endsWith(`.${lastPart}`) && k !== key
        );

        if (possibleDuplicates.length > 0) {
          report.duplicates[key] = possibleDuplicates;
        }
      }
    }
  });

  return report;
}

// 查找相似的键
function findSimilarKeys(key, availableKeys) {
  const suggestions = [];

  // 特殊处理常见的问题键
  if (key === 'notification' || key.includes('notification')) {
    // 检查是否存在 chat_notifications.notification
    const chatNotificationKey = 'chat_notifications.notification';
    if (availableKeys.includes(chatNotificationKey)) {
      suggestions.push(chatNotificationKey);
    }

    // 检查是否存在 components.notification
    const componentsNotificationKey = 'components.notification';
    if (availableKeys.includes(componentsNotificationKey)) {
      suggestions.push(componentsNotificationKey);
    }
  }

  // 检查键的最后一部分是否存在于其他路径
  const parts = key.split('.');
  const lastPart = parts[parts.length - 1];

  // 查找包含相同最后部分的键
  availableKeys.forEach(availableKey => {
    const availableParts = availableKey.split('.');
    const availableLastPart = availableParts[availableParts.length - 1];

    if (lastPart === availableLastPart && key !== availableKey) {
      suggestions.push(availableKey);
    }
  });

  // 限制建议数量
  return suggestions.slice(0, 5);
}

// 生成报告
function generateReport(scanResult, checkResult) {
  console.log('=== i18n键检测报告 ===');
  console.log(`总共扫描了 ${scanResult.allKeys.length} 个翻译键`);
  console.log(`缺失的翻译键: ${checkResult.missingCount}`);

  if (checkResult.missingCount > 0) {
    console.log('\n缺失的翻译键:');
    Object.keys(checkResult.missing).forEach(key => {
      console.log(`- ${key}`);

      // 显示建议
      if (checkResult.suggestions[key] && checkResult.suggestions[key].length > 0) {
        console.log(`  建议使用: ${checkResult.suggestions[key].join(', ')}`);
      }

      // 显示可能的重复键
      if (checkResult.duplicates[key] && checkResult.duplicates[key].length > 0) {
        console.log(`  可能的重复键: ${checkResult.duplicates[key].join(', ')}`);
      }
    });

    console.log('\n按文件分组的缺失键:');
    for (const [file, keys] of Object.entries(scanResult.keysByFile)) {
      const missingKeys = keys.filter(key => checkResult.missing[key]);
      if (missingKeys.length > 0) {
        console.log(`\n文件: ${file}`);
        missingKeys.forEach(key => {
          console.log(`  - ${key}`);

          // 显示建议
          if (checkResult.suggestions[key] && checkResult.suggestions[key].length > 0) {
            console.log(`    建议使用: ${checkResult.suggestions[key].join(', ')}`);
          }
        });
      }
    }

    // 生成修复建议
    console.log('\n修复建议:');
    console.log('1. 检查代码中使用的翻译键是否与翻译文件中的键匹配');
    console.log('2. 对于notification和chat_notifications等键，确保使用正确的命名空间');
    console.log('3. 考虑在组件中添加回退机制，尝试多个可能的键路径');

    // 生成示例代码
    console.log('\n示例代码 - 安全的翻译函数:');
    console.log(`
// 创建安全的翻译函数
const safeTranslate = (key, defaultValue = '') => {
  try {
    // 尝试直接使用键
    const t = useTranslations();
    return t(key);
  } catch (error) {
    try {
      // 尝试使用命名空间
      const parts = key.split('.');
      const namespace = parts[0];
      const restKey = parts.slice(1).join('.');

      const t = useTranslations(namespace);
      return t(restKey);
    } catch (error) {
      // 如果都失败了，返回默认值
      return defaultValue || key;
    }
  }
};
    `);
  }

  console.log('\n=== 报告结束 ===');

  // 如果有特定的notification或chat_notifications问题，提供特定的修复建议
  const hasNotificationIssue = Object.keys(checkResult.missing).some(key =>
    key === 'notification' || key.includes('notification')
  );

  if (hasNotificationIssue) {
    console.log('\n=== 特定问题修复建议 ===');
    console.log('检测到notification相关的问题，建议修复方法:');
    console.log('1. 检查i18n/messages/en.json文件中notification键的正确路径');
    console.log('2. 在组件中使用以下方式尝试多个可能的路径:');
    console.log(`
// 尝试从不同的命名空间获取翻译
const getTranslation = (key) => {
  try {
    // 首先尝试notification命名空间
    const notificationT = useTranslations('notification');
    return notificationT(key);
  } catch (error) {
    try {
      // 然后尝试components.notification命名空间
      const componentT = useTranslations('components.notification');
      return componentT(key);
    } catch (error) {
      try {
        // 最后尝试chat_notifications.notification命名空间
        const chatT = useTranslations('chat_notifications.notification');
        return chatT(key);
      } catch (error) {
        // 如果都失败了，返回默认值
        return defaultValues[key] || key;
      }
    }
  }
};
    `);
  }
}

// 主函数
function main() {
  console.log('开始扫描代码中的翻译键...');
  const scanResult = scanCodeForTranslationKeys();
  console.log(`扫描完成，找到 ${scanResult.allKeys.length} 个翻译键`);

  console.log('检查翻译键是否存在于翻译文件中...');
  const checkResult = checkTranslationKeys(scanResult.allKeys);

  generateReport(scanResult, checkResult);
}

// 运行主函数
main();
