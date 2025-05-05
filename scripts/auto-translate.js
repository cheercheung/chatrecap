/**
 * 自动翻译空键脚本
 * 
 * 使用方法:
 * node scripts/auto-translate.js
 * 
 * 此脚本会:
 * 1. 识别所有空的翻译键
 * 2. 使用Google翻译API自动翻译
 * 3. 将翻译结果写入对应的翻译文件
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { translate } = require('@vitalets/google-translate-api');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// 配置
const config = {
  // 源语言（基准语言）
  sourceLanguage: 'en',
  // 目标语言
  targetLanguages: ['zh'],
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
  // 批处理大小，避免API限制
  batchSize: 10,
  // 批处理间隔（毫秒）
  batchInterval: 1000
};

// 读取JSON文件
async function readJsonFile(filePath) {
  try {
    const data = await readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

// 写入JSON文件
async function writeJsonFile(filePath, data) {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    await writeFile(filePath, jsonData, 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    return false;
  }
}

// 获取所有键（递归）
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

// 根据键路径获取值
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

// 根据键路径设置值
function setValueByPath(obj, path, value) {
  const parts = path.split('.');
  let current = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (current[part] === undefined) {
      current[part] = {};
    }
    current = current[part];
  }
  
  current[parts[parts.length - 1]] = value;
}

// 延迟函数
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 翻译文本
async function translateText(text, targetLang) {
  try {
    // 如果文本为空，返回空字符串
    if (!text || text.trim() === '') {
      return '';
    }
    
    // 如果文本包含HTML标签或变量，需要特殊处理
    const hasHtml = /<[^>]*>/g.test(text);
    const hasVariables = /\{[^}]*\}/g.test(text);
    
    if (hasHtml || hasVariables) {
      // 保存标签和变量
      const placeholders = [];
      let index = 0;
      
      // 替换HTML标签和变量为占位符
      const cleanText = text.replace(/(<[^>]*>|\{[^}]*\})/g, match => {
        const placeholder = `__PH${index}__`;
        placeholders.push({ placeholder, value: match });
        index++;
        return placeholder;
      });
      
      // 翻译清理后的文本
      const { text: translatedCleanText } = await translate(cleanText, { to: targetLang });
      
      // 恢复占位符
      let translatedText = translatedCleanText;
      for (const { placeholder, value } of placeholders) {
        translatedText = translatedText.replace(placeholder, value);
      }
      
      return translatedText;
    } else {
      // 直接翻译普通文本
      const { text: translatedText } = await translate(text, { to: targetLang });
      return translatedText;
    }
  } catch (error) {
    console.error(`Translation error: ${error.message}`);
    // 出错时返回原文
    return text;
  }
}

// 批量翻译
async function batchTranslate(items, targetLang) {
  const results = [];
  
  // 分批处理
  for (let i = 0; i < items.length; i += config.batchSize) {
    const batch = items.slice(i, i + config.batchSize);
    const batchPromises = batch.map(async item => {
      const translatedText = await translateText(item.sourceValue, targetLang);
      return {
        ...item,
        translatedValue: translatedText
      };
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // 添加延迟，避免API限制
    if (i + config.batchSize < items.length) {
      await delay(config.batchInterval);
    }
  }
  
  return results;
}

// 查找空键并翻译
async function findEmptyKeysAndTranslate() {
  // 遍历所有翻译路径
  for (const translationPath of config.translationPaths) {
    const dirPath = translationPath.path;
    const sourcePath = path.join(dirPath, `${config.sourceLanguage}.json`);
    const sourceData = await readJsonFile(sourcePath);
    
    if (!sourceData) {
      console.error(`Source file not found: ${sourcePath}`);
      continue;
    }
    
    // 获取源语言的所有键
    const sourceKeys = getAllKeys(sourceData);
    
    // 处理每个目标语言
    for (const targetLang of config.targetLanguages) {
      const targetPath = path.join(dirPath, `${targetLang}.json`);
      const targetData = await readJsonFile(targetPath);
      
      if (!targetData) {
        console.error(`Target file not found: ${targetPath}`);
        continue;
      }
      
      // 查找空键
      const emptyKeys = [];
      for (const key of sourceKeys) {
        const sourceValue = getValueByPath(sourceData, key);
        const targetValue = getValueByPath(targetData, key);
        
        // 如果目标语言的值为空字符串
        if (targetValue === '') {
          emptyKeys.push({
            key,
            sourceValue
          });
        }
      }
      
      console.log(`Found ${emptyKeys.length} empty keys in ${targetLang} for ${translationPath.name}`);
      
      if (emptyKeys.length > 0) {
        // 批量翻译
        console.log(`Translating ${emptyKeys.length} keys for ${targetLang}...`);
        const translatedItems = await batchTranslate(emptyKeys, targetLang);
        
        // 更新目标文件
        let updated = false;
        for (const item of translatedItems) {
          setValueByPath(targetData, item.key, item.translatedValue);
          updated = true;
        }
        
        // 保存更新后的文件
        if (updated) {
          await writeJsonFile(targetPath, targetData);
          console.log(`Updated ${translatedItems.length} translations for ${targetLang} in ${translationPath.name}`);
        }
      }
    }
  }
}

// 主函数
async function main() {
  try {
    console.log('Starting automatic translation of empty keys...');
    await findEmptyKeysAndTranslate();
    console.log('Translation completed!');
  } catch (error) {
    console.error('Error during translation:', error);
  }
}

main();
