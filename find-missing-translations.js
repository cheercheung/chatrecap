const fs = require('fs');

// 读取en.json文件
const messagesEnPath = 'i18n/messages/en.json';
const messagesEn = JSON.parse(fs.readFileSync(messagesEnPath, 'utf8'));

// 递归查找空值
function findEmptyTranslations(obj, prefix = '') {
  let emptyKeys = [];
  for (const key in obj) {
    const newPrefix = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      emptyKeys = [...emptyKeys, ...findEmptyTranslations(obj[key], newPrefix)];
    } else if (obj[key] === '') {
      emptyKeys.push(newPrefix);
    }
  }
  return emptyKeys;
}

// 查找空的翻译键
const emptyMessagesKeys = findEmptyTranslations(messagesEn);

console.log('Empty translation keys in messages/en.json:');
console.log(emptyMessagesKeys);
console.log(`Total empty keys: ${emptyMessagesKeys.length}`);
