/**
 * 列出 Supabase 数据库中的所有表
 * 
 * 使用方法：
 * node tests/list-tables.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// 初始化 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
  try {
    console.log('正在查询数据库表...');
    
    // 查询所有表
    const { data, error } = await supabase
      .from('pg_catalog.pg_tables')
      .select('schemaname, tablename')
      .eq('schemaname', 'public');
    
    if (error) {
      console.error('查询表失败:', error);
      
      // 尝试使用另一种方式查询
      console.log('尝试使用另一种方式查询...');
      const { data: tables, error: err } = await supabase.rpc('get_tables');
      
      if (err) {
        console.error('查询表失败:', err);
        return;
      }
      
      console.log('数据库表:');
      console.log(tables);
      return;
    }
    
    console.log('数据库表:');
    console.log(data);
    
    // 尝试查询 auth.users 表
    console.log('\n尝试查询 auth.users 表...');
    const { data: authUsers, error: authError } = await supabase
      .from('auth.users')
      .select('id, email')
      .limit(5);
    
    if (authError) {
      console.error('查询 auth.users 失败:', authError);
    } else {
      console.log('auth.users 表中的用户:');
      console.log(authUsers);
    }
    
  } catch (error) {
    console.error('执行查询时出错:', error);
  }
}

// 运行函数
listTables();
