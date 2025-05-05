# 国际化(i18n)翻译工作流程

本文档描述了如何使用i18n-ally插件和辅助脚本来管理和完成翻译工作。

## 准备工作

1. 安装VSCode插件：
   - [i18n-ally](https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally)

2. 确保项目中有正确的配置：
   - `.vscode/settings.json`中包含i18n-ally的配置
   - 翻译文件位于`i18n/messages/`和`i18n/pages/landing/`目录下

## 翻译工作流程

### 1. 分析缺失的翻译

使用辅助脚本分析缺失的翻译：

```bash
node scripts/i18n-helper.js analyze
```

这将生成一个报告，显示所有缺失的翻译键。

### 2. 填充缺失的翻译

使用辅助脚本填充缺失的翻译（使用英文作为默认值）：

```bash
node scripts/i18n-helper.js fill
```

这将把所有缺失的翻译键填充为英文值，作为翻译的起点。

### 3. 使用i18n-ally进行翻译

1. 打开VSCode，确保i18n-ally插件已激活
2. 在侧边栏中点击i18n-ally图标
3. 浏览翻译键树状结构
4. 点击需要翻译的键
5. 在编辑器中输入翻译
6. 保存文件

### 4. 批量翻译

对于大量需要翻译的键，可以使用i18n-ally的批量翻译功能：

1. 右键点击一个文件夹或命名空间
2. 选择"批量翻译"
3. 选择源语言(en)和目标语言(zh)
4. 使用机器翻译或手动输入翻译

### 5. 检查翻译质量

完成翻译后，检查翻译质量：

1. 确保翻译符合项目的术语表
2. 检查翻译是否自然流畅
3. 确保翻译长度适合UI布局
4. 检查特殊字符和格式化标记是否正确

### 6. 提交翻译

完成翻译后，提交更改：

1. 使用git提交更改
2. 在提交信息中注明已完成的翻译部分
3. 推送到远程仓库

## 翻译键命名规则

翻译键使用嵌套结构，遵循以下规则：

1. 顶级键是功能模块或页面名称
2. 第二级键是组件或功能名称
3. 第三级键是具体的文本类型

例如：
- `messages.chatrecapresult.title` - 聊天分析结果页面的标题
- `landing.footer.copyright` - 首页底部的版权信息

## 翻译变量

翻译中的变量使用花括号表示，例如：`{count}`。翻译时需要保留这些变量。

例如：
- 英文：`{count} messages`
- 中文：`{count} 条消息`

## 常见问题

### 如何处理复数形式？

对于需要处理复数形式的翻译，使用`_one`和`_other`后缀：

- `messages_count_one`: 单数形式
- `messages_count_other`: 复数形式

### 如何处理长文本？

对于长文本，可以使用多行字符串：

```json
{
  "long_text": "这是第一行。\n这是第二行。"
}
```

### 如何处理HTML标记？

有些翻译可能包含HTML标记，翻译时需要保留这些标记：

- 英文：`Your conversation has <span class="highlight">{count}</span> messages`
- 中文：`您的对话有 <span class="highlight">{count}</span> 条消息`
