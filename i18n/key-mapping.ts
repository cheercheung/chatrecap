/**
 * 翻译键映射文件
 * 
 * 这个文件将缺失的翻译键映射到现有的翻译键，
 * 以确保即使使用了错误的键也能找到正确的翻译。
 */

export const keyMapping: Record<string, string> = {
  // 平台相关键
  'whatsapp.title': 'platforms.whatsapp.title',
  'whatsapp.description': 'platforms.whatsapp.description',
  'whatsapp.button': 'platforms.whatsapp.button',
  'whatsapp.download_guide': 'platforms.whatsapp.download_guide',
  
  'instagram.title': 'platforms.instagram.title',
  'instagram.description': 'platforms.instagram.description',
  'instagram.button': 'platforms.instagram.button',
  'instagram.download_guide': 'platforms.instagram.download_guide',
  
  'snapchat.title': 'platforms.snapchat.title',
  'snapchat.description': 'platforms.snapchat.description',
  'snapchat.button': 'platforms.snapchat.button',
  'snapchat.download_guide': 'platforms.snapchat.download_guide',
  
  'telegram.title': 'platforms.telegram.title',
  'telegram.description': 'platforms.telegram.description',
  'telegram.button': 'platforms.telegram.button',
  'telegram.download_guide': 'platforms.telegram.download_guide',
  
  'discord.title': 'platforms.discord.title',
  'discord.description': 'platforms.discord.description',
  'discord.button': 'platforms.discord.button',
  'discord.download_guide': 'platforms.discord.download_guide',
  
  // 结果页面键
  'chatrecapresult.title': 'results.title',
  'chatrecapresult.description': 'results.description',
  
  'results.summary_title': 'chat_analysis.results.summary_title',
  'results.summary_description': 'chat_analysis.results.summary_description',
  'results.total_messages': 'chat_analysis.results.total_messages',
  'results.valid_date_messages': 'chat_analysis.results.valid_date_messages',
  'results.date_range': 'chat_analysis.results.date_range',
  'results.participants': 'chat_analysis.results.participants',
  'results.filtered_messages': 'chat_analysis.results.filtered_messages',
  'results.system_messages': 'chat_analysis.results.system_messages',
  'results.media_messages': 'chat_analysis.results.media_messages',
  'results.warnings_title': 'chat_analysis.results.warnings_title',
  'results.messages_title': 'chat_analysis.results.messages_title',
  'results.messages_description': 'chat_analysis.results.messages_description',
  'results.search_placeholder': 'chat_analysis.results.search_placeholder',
  'results.search': 'chat_analysis.results.search',
  'results.no_search_results': 'chat_analysis.results.no_search_results',
  'results.no_messages': 'chat_analysis.results.no_messages',
  'results.previous': 'chat_analysis.results.previous',
  'results.next': 'chat_analysis.results.next',
  'results.page_info': 'chat_analysis.results.page_info',
  'results.unknown_date_range': 'chat_analysis.results.unknown_date_range',
  
  // 处理状态键
  'processing.preparing': 'chat_analysis.processing.preparing',
  'processing.cleaning': 'chat_analysis.processing.cleaning',
  'processing.analyzing': 'chat_analysis.processing.analyzing',
  'processing.completed': 'chat_analysis.processing.completed',
  'processing.status_fetch_failed': 'chat_analysis.processing.status_fetch_failed',
  'processing.result_fetch_failed': 'chat_analysis.processing.result_fetch_failed',
  
  // 上传相关键
  'upload.failed': 'chat_analysis.upload.failed',
  'upload.supported_formats': 'chat_analysis.upload.supported_formats',
  
  // 分享相关键
  'share.link_copied': 'components.action_buttons.link_copied',
  'share.copy_failed': 'components.action_buttons.copy_failed',
  
  // 聊天通知键
  'speakers.girlfriend': 'chat_notifications.speakers.girlfriend',
  'speakers.boyfriend': 'chat_notifications.speakers.boyfriend',
  'speakers.her': 'chat_notifications.speakers.her',
  'messages.message1': 'chat_notifications.messages.message1',
  'messages.message2': 'chat_notifications.messages.message2',
  'messages.message3': 'chat_notifications.messages.message3',
  'times.days_ago': 'chat_notifications.times.days_ago',
  'times.minutes_ago': 'chat_notifications.times.minutes_ago'
};
