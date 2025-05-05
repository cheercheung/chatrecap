/**
 * i18n 翻译辅助脚本
 * 
 * 这个脚本帮助您：
 * 1. 识别缺失的翻译键
 * 2. 将英文翻译复制到其他语言文件中
 * 3. 生成翻译报告
 */

const fs = require('fs');
const path = require('path');

// 配置
const config = {
  // 源语言（基准语言）
  sourceLanguage: 'en',
  // 目标语言
  targetLanguages: ['zh', 'de', 'es', 'fr', 'it', 'ja', 'ko', 'tr'],
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

// 写入JSON文件
function writeJsonFile(filePath, data) {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData, 'utf8');
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

// 分析翻译文件
function analyzeTranslations() {
  const report = {
    total: 0,
    missing: {},
    missingCount: 0
  };
  
  // 遍历所有翻译路径
  for (const translationPath of config.translationPaths) {
    const dirPath = translationPath.path;
    const sourcePath = path.join(dirPath, `${config.sourceLanguage}.json`);
    const sourceData = readJsonFile(sourcePath);
    
    if (!sourceData) {
      console.error(`Source file not found: ${sourcePath}`);
      continue;
    }
    
    // 获取源语言的所有键
    const sourceKeys = getAllKeys(sourceData);
    report.total += sourceKeys.length;
    
    // 检查每个目标语言
    for (const targetLang of config.targetLanguages) {
      const targetPath = path.join(dirPath, `${targetLang}.json`);
      const targetData = readJsonFile(targetPath);
      
      if (!targetData) {
        console.error(`Target file not found: ${targetPath}`);
        continue;
      }
      
      // 检查缺失的键
      for (const key of sourceKeys) {
        const sourceValue = getValueByPath(sourceData, key);
        const targetValue = getValueByPath(targetData, key);
        
        // 如果目标语言缺少这个键或值为空
        if (targetValue === undefined || targetValue === '') {
          if (!report.missing[targetLang]) {
            report.missing[targetLang] = [];
          }
          
          report.missing[targetLang].push({
            path: `${translationPath.name}.${key}`,
            sourceValue
          });
          
          report.missingCount++;
        }
      }
    }
  }
  
  return report;
}

// 填充缺失的翻译
function fillMissingTranslations() {
  // 遍历所有翻译路径
  for (const translationPath of config.translationPaths) {
    const dirPath = translationPath.path;
    const sourcePath = path.join(dirPath, `${config.sourceLanguage}.json`);
    const sourceData = readJsonFile(sourcePath);
    
    if (!sourceData) {
      console.error(`Source file not found: ${sourcePath}`);
      continue;
    }
    
    // 获取源语言的所有键
    const sourceKeys = getAllKeys(sourceData);
    
    // 处理每个目标语言
    for (const targetLang of config.targetLanguages) {
      const targetPath = path.join(dirPath, `${targetLang}.json`);
      const targetData = readJsonFile(targetPath);
      
      if (!targetData) {
        console.error(`Target file not found: ${targetPath}`);
        continue;
      }
      
      let updated = false;
      
      // 检查缺失的键
      for (const key of sourceKeys) {
        const sourceValue = getValueByPath(sourceData, key);
        const targetValue = getValueByPath(targetData, key);
        
        // 如果目标语言缺少这个键或值为空
        if (targetValue === undefined || targetValue === '') {
          // 复制源语言的值
          setValueByPath(targetData, key, sourceValue);
          updated = true;
        }
      }
      
      // 保存更新后的文件
      if (updated) {
        writeJsonFile(targetPath, targetData);
        console.log(`Updated translations for ${targetLang} in ${translationPath.name}`);
      }
    }
  }
}

// 生成翻译报告
function generateReport() {
  const report = analyzeTranslations();
  
  console.log('\n===== 翻译报告 =====');
  console.log(`总键数: ${report.total}`);
  console.log(`缺失键数: ${report.missingCount}`);
  console.log('\n缺失键详情:');
  
  for (const lang in report.missing) {
    console.log(`\n${lang} (${report.missing[lang].length} 个缺失):`);
    
    for (const item of report.missing[lang]) {
      console.log(`  - ${item.path}: "${item.sourceValue}"`);
    }
  }
  
  // 保存报告到文件
  const reportData = {
    generatedAt: new Date().toISOString(),
    ...report
  };
  
  writeJsonFile('i18n-report.json', reportData);
  console.log('\n报告已保存到 i18n-report.json');
}

// 主函数
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'analyze':
      generateReport();
      break;
    case 'fill':
      fillMissingTranslations();
      break;
    default:
      console.log('用法:');
      console.log('  node i18n-helper.js analyze - 分析翻译并生成报告');
      console.log('  node i18n-helper.js fill - 填充缺失的翻译');
  }
}

main();
