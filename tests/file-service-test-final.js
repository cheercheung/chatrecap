/**
 * 文件服务测试脚本 (适配真实表结构)
 *
 * 使用方法：
 * node tests/file-service-test-final.js [用户ID]
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

// 初始化 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 获取命令行参数
const userId = process.argv[2] || 'b7e1c2d3-4f5a-6789-bcde-123456789abc';

// 文件状态枚举（根据实际情况可能需要调整）
const ChatFileStatus = {
  UPLOADED: 'uploaded',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

// 主函数
async function testFileService() {
  console.log(`开始测试用户 ${userId} 的文件服务...\n`);

  try {
    // 1. 检查用户是否存在
    const { data: user, error: userError } = await supabase
      .from('User')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('用户不存在或查询出错:', userError);
      console.log('请确保用户ID存在于User表中');
      process.exit(1);
    }

    console.log('用户信息:', {
      id: user.id,
      username: user.username,
      email: user.email
    });

    // 2. 创建文件记录
    console.log('\n创建文件记录...');
    const fileId = uuidv4();
    const fileName = `test_file_${Date.now()}.txt`;
    const fileUrl = `https://example.com/files/${fileId}`;

    const { data: file, error: fileError } = await supabase
      .from('ChatFile')
      .insert({
        id: fileId,
        user_id: userId,
        file_name: fileName,
        file_url: fileUrl,
        uploaded_at: new Date().toISOString()
      })
      .select()
      .single();

    if (fileError) {
      console.error('创建文件记录失败:', fileError);
      process.exit(1);
    }

    console.log(`文件记录创建成功，ID: ${file.id}`);
    console.log('文件信息:', {
      id: file.id,
      文件名: file.file_name,
      URL: file.file_url,
      上传时间: file.uploaded_at
    });

    // 3. 查询用户的所有文件
    console.log('\n查询用户的所有文件...');
    const { data: userFiles, error: userFilesError } = await supabase
      .from('ChatFile')
      .select('*')
      .eq('user_id', userId)
      .order('uploaded_at', { ascending: false });

    if (userFilesError) {
      console.error('查询用户文件失败:', userFilesError);
      process.exit(1);
    }

    console.log(`用户 ${userId} 的文件数量: ${userFiles.length}`);
    if (userFiles.length > 0) {
      console.log('最近的文件:', userFiles.slice(0, 3).map(f => ({
        id: f.id,
        文件名: f.file_name,
        上传时间: f.uploaded_at
      })));
    }

    // 4. 创建积分消费记录（模拟文件分析消费积分）
    console.log('\n创建积分消费记录（模拟文件分析）...');

    // 获取用户当前积分余额
    let currentBalance = 0;
    const { data: latestTransaction, error: balanceError } = await supabase
      .from('CreditTransaction')
      .select('balance_after')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (!balanceError && latestTransaction && latestTransaction.length > 0) {
      currentBalance = latestTransaction[0].balance_after;
    }

    console.log(`当前积分余额: ${currentBalance}`);

    // 消费积分
    const consumeAmount = -100; // 负数表示消费
    const newBalance = currentBalance + consumeAmount;
    const transactionId = uuidv4();

    const { data: transaction, error: transactionError } = await supabase
      .from('CreditTransaction')
      .insert({
        id: transactionId,
        user_id: userId,
        change_amount: consumeAmount,
        balance_after: newBalance,
        type: 'consume',
        description: `文件 ${file.file_name} 分析消费`,
        created_at: new Date().toISOString(),
        file_id: file.id  // 添加文件ID关联
      })
      .select()
      .single();

    if (transactionError) {
      console.error('创建积分消费记录失败:', transactionError);
      process.exit(1);
    }

    console.log(`积分消费记录创建成功，ID: ${transaction.id}`);
    console.log('积分变更:', {
      变更金额: transaction.change_amount,
      变更后余额: transaction.balance_after
    });

    // 5. 先删除关联的积分交易记录，再删除测试文件
    console.log('\n删除关联的积分交易记录...');
    const { error: deleteTransactionError } = await supabase
      .from('CreditTransaction')
      .delete()
      .eq('file_id', file.id);

    if (deleteTransactionError) {
      console.error('删除积分交易记录失败:', deleteTransactionError);
      process.exit(1);
    }

    console.log(`关联的积分交易记录删除成功`);

    // 然后删除文件记录
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

    // 6. 验证最终结果
    console.log('\n验证最终结果...');
    const { data: finalFiles } = await supabase
      .from('ChatFile')
      .select('*')
      .eq('user_id', userId)
      .order('uploaded_at', { ascending: false })
      .limit(5);

    console.log(`用户 ${userId} 的文件数量: ${finalFiles.length}`);

    const { data: transactions } = await supabase
      .from('CreditTransaction')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    console.log('最近交易记录:', transactions.map(t => ({
      id: t.id,
      类型: t.type,
      变更金额: t.change_amount,
      变更后余额: t.balance_after,
      描述: t.description,
      文件ID: t.file_id || '无',
      时间: t.created_at
    })));

    console.log('\n文件服务测试完成！');
  } catch (error) {
    console.error('测试过程中出错:', error);
  }
}

// 运行测试
testFileService();
