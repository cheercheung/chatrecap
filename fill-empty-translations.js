const fs = require('fs');

// 读取en.json文件
const messagesEnPath = 'i18n/messages/en.json';
const messagesEn = JSON.parse(fs.readFileSync(messagesEnPath, 'utf8'));

// 递归查找并填充空值
function fillEmptyTranslations(obj, path = []) {
  let updated = false;
  
  for (const key in obj) {
    const newPath = [...path, key];
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // 递归处理嵌套对象
      const nestedUpdated = fillEmptyTranslations(obj[key], newPath);
      if (nestedUpdated) updated = true;
    } else if (obj[key] === '') {
      // 将空字符串替换为键名
      const keyName = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
      obj[key] = keyName;
      console.log(`Filled: ${newPath.join('.')} = "${keyName}"`);
      updated = true;
    }
  }
  
  return updated;
}

// 填充空的翻译键
const updated = fillEmptyTranslations(messagesEn);

if (updated) {
  // 写回文件
  fs.writeFileSync(messagesEnPath, JSON.stringify(messagesEn, null, 2), 'utf8');
  console.log('Updated en.json with filled translations');
} else {
  console.log('No empty translations found');
}
