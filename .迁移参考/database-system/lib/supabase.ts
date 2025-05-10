import { createClient } from '@supabase/supabase-js'

// 从环境变量中获取 Supabase URL 和匿名密钥
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 存储桶名称
export const STORAGE_BUCKET = {
  CHAT_FILES: 'chat-files',
  ANALYSIS_RESULTS: 'analysis-results'
}

/**
 * 上传文件到 Supabase 存储
 * @param bucket 存储桶名称
 * @param path 文件路径
 * @param file 文件对象
 * @returns 上传结果
 */
export async function uploadFile(bucket: string, path: string, file: File) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    throw error
  }

  return data
}

/**
 * 从 Supabase 存储获取文件公共 URL
 * @param bucket 存储桶名称
 * @param path 文件路径
 * @returns 文件公共 URL
 */
export function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

/**
 * 从 Supabase 存储下载文件
 * @param bucket 存储桶名称
 * @param path 文件路径
 * @returns 下载结果
 */
export async function downloadFile(bucket: string, path: string) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .download(path)

  if (error) {
    throw error
  }

  return data
}

/**
 * 从 Supabase 存储删除文件
 * @param bucket 存储桶名称
 * @param paths 文件路径数组
 * @returns 删除结果
 */
export async function removeFiles(bucket: string, paths: string[]) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .remove(paths)

  if (error) {
    throw error
  }

  return data
}
