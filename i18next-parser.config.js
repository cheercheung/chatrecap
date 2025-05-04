module.exports = {
  // 输出目录，与现有的翻译文件目录保持一致
  output: 'i18n/messages/$LOCALE.json',

  // 支持的语言列表，与项目中定义的语言列表保持一致
  locales: ['en', 'zh', 'es', 'tr', 'it', 'de', 'ko', 'fr', 'ja'],

  // 默认命名空间
  defaultNamespace: 'translation',

  // 保留未使用的翻译键
  keepRemoved: true,



  // 添加新的键到翻译文件中
  addKeyAsReference: true,

  // 保留现有的翻译值
  keepOldTranslationValues: true,

  // 排序键
  sort: true,

  // 解析器选项
  lexers: {
    js: ['JsxLexer'], // 解析 .js 文件
    jsx: ['JsxLexer'], // 解析 .jsx 文件
    ts: ['JsxLexer'], // 解析 .ts 文件
    tsx: ['JsxLexer'], // 解析 .tsx 文件
    default: ['JsxLexer'],
  },

  // 需要解析的函数名
  // 根据项目中使用的翻译函数进行配置
  func: {
    list: ['t', 'useTranslations', 'getTranslations'],
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },

  // 需要解析的组件名
  trans: {
    component: 'Trans',
    i18nKey: 'i18nKey',
    defaultsKey: 'defaults',
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    fallbackKey: function(ns, value) {
      return value;
    }
  },

  // 需要解析的属性
  attr: {
    list: ['title', 'alt', 'placeholder', 'data-tooltip'],
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },

  // 创建空的翻译文件
  createOldCatalogs: false,

  // 保留嵌套的键
  keySeparator: '.',

  // 命名空间分隔符
  namespaceSeparator: ':',

  // 忽略的文件/目录
  ignore: ['node_modules', 'public', '.next', 'out', 'build'],

  // 是否覆盖已有的翻译
  overwrite: false,

  // 是否保留空白键
  skipDefaultValues: false,

  // 是否使用 BCP 47 语言标签
  useKeysAsDefaultValue: false,

  // 是否将键作为默认值
  useKeysAsDefaultValue: false,

  // 是否将命名空间添加到键中
  useKeysAsDefaultValue: false,

  // 使用现有的翻译值作为默认值
  defaultValue: function(locale, namespace, key, value) {
    return value;
  },

  // 保留现有的翻译值
  updateValue: function(locale, namespace, key, value, oldValue) {
    return oldValue || value;
  },

  // 是否将命名空间添加到键中
  resetDefaultValueLocale: null,

  // 是否将命名空间添加到键中
  verbose: false,
};
