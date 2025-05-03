import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

// 支持的语言列表
export const locales = ['en','zh',"es","tr","de","ko","fr","ja"];
export const defaultLocale = 'en';

export default getRequestConfig(async ({locale}) => {
  // 验证请求的语言是否在支持的语言列表中
  if (!locales.includes(locale as any)) notFound();

  return {
    locale,
    messages: (await import(`@/i18n/messages/${locale}.json`)).default,
    timeZone: 'Asia/Shanghai',
    now: new Date(),
  };
});
