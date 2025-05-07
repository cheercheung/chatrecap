# 国际化 (i18n) 最佳实践指南

本文档提供了项目中使用的国际化 (i18n) 规范和最佳实践，以确保翻译的一致性和可维护性。

## 翻译文件结构

项目使用以下翻译文件结构：

```
i18n/
├── messages/           # 全局翻译文件
│   ├── en.json         # 英文翻译
│   ├── zh.json         # 中文翻译
│   └── [其他语言].json
├── pages/              # 页面特定翻译
│   └── landing/        # 首页翻译
│       ├── en.json     # 英文首页
│       ├── zh.json     # 中文首页
│       └── [其他语言].json
└── prompts/            # 提示文本翻译
    ├── en.json
    ├── zh.json
    └── [其他语言].json
```

## 翻译键命名规则

1. **使用嵌套结构**：翻译键应使用嵌套结构，以便于组织和管理。
   ```json
   {
     "components": {
       "notification": {
         "limited_time_offer": "Limited Time Offer!"
       }
     }
   }
   ```

2. **命名空间**：使用命名空间来组织相关的翻译键。
   - 组件相关：`components.{component_name}`
   - 页面相关：`{page_name}`
   - 错误信息：`errors`

3. **一致性**：保持键名的一致性，避免混合使用扁平结构和嵌套结构。

## 翻译使用方法

### 服务器组件

在服务器组件中使用 `getTranslations` 函数：

```tsx
import { getTranslations } from 'next-intl/server';

export async function MyServerComponent() {
  const t = await getTranslations('namespace');
  return <div>{t('key')}</div>;
}
```

### 客户端组件

在客户端组件中使用 `useSafeTranslation` 钩子：

```tsx
import { useSafeTranslation } from '@/components/i18n/safe-translation';

export function MyClientComponent() {
  const t = useSafeTranslation(['namespace', 'fallback.namespace']);
  return <div>{t('key', 'Default Value')}</div>;
}
```

### 安全翻译组件

对于需要在 JSX 中直接使用的翻译，使用 `SafeTranslation` 组件：

```tsx
import SafeTranslation from '@/components/i18n/safe-translation';

export function MyComponent() {
  return (
    <SafeTranslation
      keyPath="limited_time_offer"
      fallbackNamespaces={['notification', 'components.notification']}
      defaultValue="Limited Time Offer!"
    />
  );
}
```

## 错误处理

始终为翻译提供回退机制，避免因翻译缺失导致应用崩溃：

1. **使用安全翻译**：使用 `useSafeTranslation` 和 `SafeTranslation` 来处理可能的翻译缺失。

2. **提供默认值**：始终为翻译提供默认值。
   ```tsx
   const t = useSafeTranslation(['namespace']);
   t('key', 'Default Value');
   ```

3. **使用默认值对象**：对于多个相关的翻译键，使用默认值对象。
   ```tsx
   const t = useSafeTranslation(['footer', 'components.footer'], {
     copyright: "© 2025 ChatRecap AI. All rights reserved.",
     privacy_policy: "Privacy Policy"
   });
   ```

## 翻译提取和更新

1. **运行提取脚本**：使用以下命令提取翻译键：
   ```bash
   npm run i18n:extract        # 提取全局翻译
   npm run i18n:extract:landing # 提取首页翻译
   npm run i18n:extract:both   # 提取全部翻译
   ```

2. **检查缺失的键**：使用以下命令检查缺失的翻译键：
   ```bash
   node scripts/i18n-key-detector.js
   ```

3. **填充缺失的翻译**：使用以下命令填充缺失的翻译：
   ```bash
   node scripts/i18n-helper.js fill
   ```

## 常见问题和解决方案

### 1. 翻译键不存在

**问题**：使用了不存在的翻译键，导致错误。

**解决方案**：
- 使用 `useSafeTranslation` 提供回退机制
- 确保翻译键在翻译文件中存在
- 提供默认值

### 2. 命名空间不一致

**问题**：在不同的组件中使用了不同的命名空间路径。

**解决方案**：
- 使用 `useSafeTranslation` 尝试多个可能的命名空间
- 统一命名空间使用规范
- 在翻译文件中保持一致的结构

### 3. 参数传递问题

**问题**：翻译函数需要传递参数，但参数格式不正确。

**解决方案**：
- 使用正确的参数格式：`t('key', { param: value })`
- 确保翻译文本中包含对应的参数占位符：`"Hello, {name}!"`

## 最佳实践总结

1. **使用安全翻译**：始终使用 `useSafeTranslation` 和 `SafeTranslation` 来处理可能的翻译缺失。

2. **提供默认值**：为所有翻译提供默认值，避免因翻译缺失导致显示问题。

3. **保持一致性**：使用一致的命名空间和键名结构。

4. **定期检查**：定期运行检测工具，确保所有翻译键都存在且正确。

5. **文档化**：为新添加的翻译键添加注释，说明其用途和使用位置。

6. **避免硬编码**：避免在代码中硬编码文本，始终使用翻译函数。

7. **组件化**：将常用的翻译逻辑封装为可重用的组件。
