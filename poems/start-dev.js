// 开发环境启动脚本
// 用于启动前端应用并测试n8n集成

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 启动诗词AI助手开发环境...\n');

// 检查必要的文件
const requiredFiles = [
  'package.json',
  'src/App.vue',
  'src/components/ChatAssistant.vue',
  'src/api/aiAssistant.js'
];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ 缺少必要文件: ${file}`);
    process.exit(1);
  }
}

console.log('✅ 项目文件检查通过\n');

// 安装依赖（如果需要）
if (!fs.existsSync('node_modules')) {
  console.log('📦 安装项目依赖...');
  const install = spawn('npm', ['install'], { stdio: 'inherit' });
  
  install.on('close', (code) => {
    if (code !== 0) {
      console.error(`❌ 依赖安装失败，退出码: ${code}`);
      process.exit(1);
    }
    startDevServer();
  });
} else {
  startDevServer();
}

function startDevServer() {
  console.log('🌐 启动开发服务器...');
  
  const devServer = spawn('npm', ['run', 'dev'], { stdio: 'inherit' });
  
  devServer.on('close', (code) => {
    console.log(`开发服务器已停止，退出码: ${code}`);
  });
  
  // 5秒后测试n8n连接
  setTimeout(() => {
    testN8NConnection();
  }, 5000);
}

function testN8NConnection() {
  console.log('\n🔗 测试n8n webhook连接...');
  
  const testScript = spawn('node', ['test-n8n-webhook.js'], { stdio: 'inherit' });
  
  testScript.on('close', (code) => {
    if (code === 0) {
      console.log('\n🎉 所有测试完成！');
      console.log('📖 访问 http://localhost:5173 查看应用');
      console.log('🤖 AI助手位于页面右下角');
    } else {
      console.log('\n⚠️  n8n连接测试失败，但前端应用仍可运行');
      console.log('💡 提示：确保n8n服务正在运行 (npx n8n)');
    }
  });
}

// 处理退出信号
process.on('SIGINT', () => {
  console.log('\n👋 正在关闭开发环境...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 正在关闭开发环境...');
  process.exit(0);
});