const http = require('http');
const url = require('url');
const crypto = require('crypto');
const mysql = require('mysql2/promise');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const dbConfig = require('../config/dbConfig').default;

const extendedDbConfig = {
  ...dbConfig,
  waitForConnections: true,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
};



let pool = null;
let connected = false;

async function ensureDatabaseReady() {
  try {
        const tempConfig = { ...extendedDbConfig };
        delete tempConfig.database;
        
        const tempConnection = await mysql.createConnection(tempConfig);
        await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
        console.log(`数据库 ${dbConfig.database} 检查/创建完成`);
        
        await tempConnection.end();
        
        pool = mysql.createPool(extendedDbConfig);
        
        const testConnection = await pool.getConnection();
        console.log('数据库连接池连接成功！');
        testConnection.release();
        
        await createTables();
        
        connected = true;
        return true;
    }
    catch (error) {
        console.error('数据库准备失败:', error.message);
        console.error('详细错误信息:', error);
        connected = false;
        return false;
    }
}
async function createTables() {
    try {
    // 创建users表
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        avatar VARCHAR(255),
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    console.log('数据库表结构检查/创建完成');
  } catch (error) {
    console.error('创建数据库表失败:', error.message);
    throw error;
  }
}

// 定期检查连接池状态
function monitorConnectionPool() {
  setInterval(async () => {
    if (!pool) {
      console.log('连接池不存在，尝试重新创建...');
      await ensureDatabaseReady();
      return;
    }
    
    try {
      // 执行简单查询来测试连接
      const [rows] = await pool.execute('SELECT 1');
      if (rows && rows.length > 0) {
        console.log('连接池监控: 连接正常');
        connected = true;
      }
    } catch (error) {
      console.error('连接池监控: 连接异常:', error.message);
      connected = false;
      
      // 尝试重新创建连接池
      console.log('尝试重新创建连接池...');
      try {
        await ensureDatabaseReady();
      } catch (retryError) {
        console.error('重新创建连接池失败:', retryError.message);
      }
    }
  }, 30000); // 每30秒检查一次
}

// 初始化数据库连接并启动服务器
async function initializeAndStartServer() {
  console.log('正在初始化数据库连接...');
  
  // 尝试准备数据库
  const dbReady = await ensureDatabaseReady();
  
  if (dbReady) {
    console.log('数据库准备完成，启动服务器...');
    // 启动连接池监控
    monitorConnectionPool();
    // 启动HTTP服务器
    startServer();
  } else {
    console.error('数据库准备失败，但服务器仍将启动（可能会影响功能）');
    // 即使数据库准备失败，也尝试启动服务器
    startServer();
  }
}

// 启动初始化过程
initializeAndStartServer();

// 简单的密码加密（替代bcrypt）
function hashPassword(password) {
  // 使用crypto模块创建简单的哈希
  const hash = crypto.createHash('sha256');
  hash.update(password + 'gamehub_salt'); // 添加简单的盐值
  return hash.digest('hex');
}

// 简单的密码验证
function verifyPassword(password, hashedPassword) {
  // 直接比较哈希值
  return hashPassword(password) === hashedPassword;
}

// CORS处理函数
function handleCORS(response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// 发送JSON响应
function sendJSON(response, statusCode, data) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(data));
}

// 测试数据库连接
async function testDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('数据库连接成功');
    connection.release();
    return true;
  } catch (error) {
    console.error('数据库连接失败:', error.message);
    return false;
  }
}

// 处理请求的函数
function handleRequest(request, response) {
  handleCORS(response);
  
  // 处理OPTIONS请求
  if (request.method === 'OPTIONS') {
    response.writeHead(204);
    response.end();
    return;
  }
  
  const parsedUrl = url.parse(request.url, true);
  const { pathname } = parsedUrl;
  
  // 读取请求体
  let requestBody = '';
  request.on('data', chunk => {
    requestBody += chunk;
  });
  
  request.on('end', async () => {
    try {
      // 解析JSON请求体（如果有）
      const body = requestBody ? JSON.parse(requestBody) : {};
      
      // API路由处理
      
      // 用户注册
      if (pathname === '/api/register' && request.method === 'POST') {
        try {
          const { username, password } = body;
          
          // 检查用户名是否已存在
          const [users] = await pool.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
          );
          
          if (users.length > 0) {
            return sendJSON(response, 400, { error: '用户名已注册，请更换其他用户名' });
          }
          
          // 加密密码
          const hashedPassword = await hashPassword(password);
          
          // 插入新用户
          const [result] = await pool.execute(
            'INSERT INTO users (username, password, avatar, bio) VALUES (?, ?, ?, ?)',
            [username, hashedPassword, 'https://via.placeholder.com/150', '']
          );
          
          // 返回用户信息（不含密码）
          const newUser = {
            id: result.insertId,
            username,
            avatar: 'https://via.placeholder.com/150',
            bio: ''
          };
          
          return sendJSON(response, 201, {
            user: newUser,
            token: `token-${Date.now()}`
          });
        } catch (error) {
            console.error('注册失败:', error.message);
            return sendJSON(response, 500, { error: '注册失败，请稍后重试' });
        }
      }
      
      if (pathname === '/api/login' && request.method === 'POST') {
        try {
          const { username, password } = body;
          
          // 查找用户
          const [users] = await pool.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
          );
          
          if (users.length === 0) {
            return sendJSON(response, 401, { error: '用户名或密码错误' });
          }
          
          const user = users[0];
          
          // 验证密码
          const isPasswordValid = await verifyPassword(password, user.password);
          
          if (!isPasswordValid) {
            return sendJSON(response, 401, { error: '用户名或密码错误' });
          }
          
          // 返回用户信息（不含密码）
          const userWithoutPassword = {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            bio: user.bio
          };
          
          return sendJSON(response, 200, {
            user: userWithoutPassword,
            token: `token-${Date.now()}`
          });
        } catch (error) {
            console.error('登录失败:', error.message);
            return sendJSON(response, 500, { error: '登录失败，请稍后重试' });
        }
      }
      
      if (pathname.match(/^\/api\/users\/\d+$/) && request.method === 'GET') {
        try {
          const userId = parseInt(pathname.split('/').pop());
          
          const [users] = await pool.execute(
            'SELECT id, username, avatar, bio FROM users WHERE id = ?',
            [userId]
          );
          
          if (users.length === 0) {
            return sendJSON(response, 404, { error: '用户不存在' });
          }
          
          return sendJSON(response, 200, users[0]);
        } catch (error) {
            console.error('获取用户信息失败:', error.message);
            return sendJSON(response, 500, { error: '获取用户信息失败' });
        }
      }
      
      if (pathname.match(/^\/api\/users\/\d+$/) && request.method === 'PUT') {
        try {
          const userId = parseInt(pathname.split('/').pop());
          const { password, ...safeUpdates } = body;
          
          // 检查用户是否存在
          const [users] = await pool.execute(
            'SELECT * FROM users WHERE id = ?',
            [userId]
          );
          
          if (users.length === 0) {
            return sendJSON(response, 404, { error: '用户不存在' });
          }
          
          // 构建更新语句
          const updateFields = [];
          const updateValues = [];
          
          for (const [key, value] of Object.entries(safeUpdates)) {
            updateFields.push(`${key} = ?`);
            updateValues.push(value);
          }
          
          if (updateFields.length === 0) {
            return sendJSON(response, 200, {
              id: users[0].id,
              username: users[0].username,
              avatar: users[0].avatar,
              bio: users[0].bio
            });
          }
          
          // 执行更新
          updateValues.push(userId);
          await pool.execute(
            `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
          );
          
          // 返回更新后的用户信息
          const [updatedUsers] = await pool.execute(
            'SELECT id, username, avatar, bio FROM users WHERE id = ?',
            [userId]
          );
          
          return sendJSON(response, 200, updatedUsers[0]);
        } catch (error) {
            console.error('更新用户信息失败:', error.message);
            return sendJSON(response, 500, { error: '更新用户信息失败' });
        }
      }
      
      if (pathname.match(/^\/api\/users\/\d+\/change-password$/) && request.method === 'PUT') {
        try {
          const userId = parseInt(pathname.split('/').slice(-2, -1)[0]);
          const { currentPassword, newPassword } = body;
          
          // 获取用户信息
          const [users] = await pool.execute(
            'SELECT * FROM users WHERE id = ?',
            [userId]
          );
          
          if (users.length === 0) {
            return sendJSON(response, 404, { error: '用户不存在' });
          }
          
          const user = users[0];
          
          // 验证当前密码
          const isPasswordValid = await verifyPassword(currentPassword, user.password);
          
          if (!isPasswordValid) {
            return sendJSON(response, 400, { error: '当前密码错误' });
          }
          
          // 加密新密码
          const hashedNewPassword = await hashPassword(newPassword);
          
          // 更新密码
          await pool.execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedNewPassword, userId]
          );
          
          return sendJSON(response, 200, { success: true, message: '密码修改成功' });
        } catch (error) {
          console.error('修改密码失败:', error.message);
          return sendJSON(response, 500, { error: '修改密码失败' });
        }
      }
      

      
      // 处理其他路由 - 返回404
      sendJSON(response, 404, { error: '路由不存在' });
    } catch (error) {
      console.error('请求处理错误:', error.message);
      sendJSON(response, 500, { error: '服务器内部错误' });
    }
  });
}

// 创建HTTP服务器
const server = http.createServer(handleRequest);

// 启动服务器
async function startServer() {
  if (!pool) {
    console.error('错误: 无法启动服务器，因为数据库连接池未创建');
    console.error('请按照上面的说明正确配置数据库连接');
    return;
  }
  
  // 测试数据库连接
  try {
    const [rows] = await pool.execute('SELECT 1');
    console.log('数据库连接成功！');
    
    // 启动服务器
    server.listen(5000, () => {
      console.log('服务器运行在 http://localhost:5000');
      console.log('后端服务已成功连接到MySQL数据库！');
    });
  } catch (error) {
    console.error('数据库连接失败:', error.message);
    console.error('解决方案：');
    console.error('1. 确保已安装mysql2模块: npm install mysql2');
    console.error('2. 检查MySQL服务是否正在运行');
    console.error('3. 验证数据库配置是否正确');
    console.error('4. 确保数据库和表结构已创建');
    console.log('服务器启动失败，请检查数据库配置和连接！');
  }
}

// 服务器将在数据库连接成功后自动启动
console.log('服务器初始化中...请等待数据库连接完成');