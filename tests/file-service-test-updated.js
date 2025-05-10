/**
 * 文件服务测试脚本 (更新版)
 * 
 * 使用方法：
 * node tests/file-service-test-updated.js [用户ID]
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// 初始化 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 获取命令行参数
const userId = process.argv[2] || 'b7e1c2d3-4f5a-6789-bcde-123456789abc';

// 文件状态枚举
const ChatFileStatus = {
  UPLOADED: 'uploaded',
  PROCESSING: 'processing',
  COMPLETED_BASIC: 'completed_basic',
  COMPLETE_AI: 'complete_ai',
  FAILED: 'failed'
};

// 主函数
async function testFileService() {
  // 生成会话ID
  const sessionId = `test_session_${Date.now()}`;
  
  console.log(`开始测试用户 ${userId} 的文件服务...\n`);
  
  try {
    // 1. 创建文件记录
    console.log('创建文件记录...');
    const { data: file, error: fileError } = await supabase
      .from('ChatFile')
      .insert({
        user_id: userId,
        session_id: sessionId,
        file_type: 'text/plain',
        status: ChatFileStatus.UPLOADED,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (fileError) {
      console.error('创建文件记录失败:', fileError);
      process.exit(1);
    }
    
    console.log(`文件记录创建成功，ID: ${file.id}`);
    console.log('文件信息:', file);
    
    // 2. 更新文件状态为处理中
    console.log('\n更新文件状态为处理中...');
    const { data: processingFile, error: processingError } = await supabase
      .from('ChatFile')
      .update({
        status: ChatFileStatus.PROCESSING
      })
      .eq('id', file.id)
      .select()
      .single();
    
    if (processingError) {
      console.error('更新文件状态失败:', processingError);
      process.exit(1);
    }
    
    console.log('文件状态更新为处理中:', processingFile);
    
    // 3. 更新文件状态为基础分析完成
    console.log('\n更新文件状态为基础分析完成...');
    const { data: basicCompleteFile, error: basicError } = await supabase
      .from('ChatFile')
      .update({
        status: ChatFileStatus.COMPLETED_BASIC,
        words_count: 1000,
        basic_result_path: `/results/${file.id}.basic.json`
      })
      .eq('id', file.id)
      .select()
      .single();
    
    if (basicError) {
      console.error('更新文件状态失败:', basicError);
      process.exit(1);
    }
    
    console.log('文件状态更新为基础分析完成:', basicCompleteFile);
    
    // 4. 更新文件状态为AI分析完成
    console.log('\n更新文件状态为AI分析完成...');
    const { data: aiCompleteFile, error: aiError } = await supabase
      .from('ChatFile')
      .update({
        status: ChatFileStatus.COMPLETE_AI,
        ai_result_path: `/results/${file.id}.ai.json`
      })
      .eq('id', file.id)
      .select()
      .single();
    
    if (aiError) {
      console.error('更新文件状态失败:', aiError);
      process.exit(1);
    }
    
    console.log('文件状态更新为AI分析完成:', aiCompleteFile);
    
    // 5. 查询文件
    console.log('\n查询文件...');
    const { data: queriedFile, error: queryError } = await supabase
      .from('ChatFile')
      .select('*')
      .eq('id', file.id)
      .single();
    
    if (queryError) {
      console.error('查询文件失败:', queryError);
      process.exit(1);
    }
    
    console.log('查询文件结果:', queriedFile);
    
    // 6. 查询用户的所有文件
    console.log('\n查询用户的所有文件...');
    const { data: userFiles, error: userFilesError } = await supabase
      .from('ChatFile')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (userFilesError) {
      console.error('查询用户文件失败:', userFilesError);
      process.exit(1);
    }
    
    console.log(`用户 ${userId} 的文件数量: ${userFiles.length}`);
    console.log('最近的文件:', userFiles.slice(0, 3));
    
    // 7. 查询会话的所有文件
    console.log('\n查询会话的所有文件...');
    const { data: sessionFiles, error: sessionFilesError } = await supabase
      .from('ChatFile')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });
    
    if (sessionFilesError) {
      console.error('查询会话文件失败:', sessionFilesError);
      process.exit(1);
    }
    
    console.log(`会话 ${sessionId} 的文件数量: ${sessionFiles.length}`);
    
    // 8. 删除测试文件
    console.log('\n删除测试文件...');
    const { error: deleteError } = await supabase
      .from('ChatFile')
      .delete()
      .eq('id', file.id);
    
    if (deleteError) {
      console.error('删除文件失败:', deleteError);
      process.exit(1);
    }
    
    console.log(`文件 ${file.id} 删除成功`);
    
    console.log('\n文件服务测试完成！');
  } catch (error) {
    console.error('测试过程中出错:', error);
  }
}

// 运行测试
testFileService();
