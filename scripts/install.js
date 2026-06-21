const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

function main() {
  const projectDir = path.resolve(__dirname, '..');
  const configDir = path.join(os.homedir(), '.config', 'opencode');
  const configPath = path.join(configDir, 'opencode.json');
  const entryPoint = path.join(projectDir, 'out', 'ds', 'mcp-server.js');

  console.log('=== vue-js-lowcode MCP 安装工具 ===\n');

  // 1. npm install
  if (!fs.existsSync(path.join(projectDir, 'node_modules'))) {
    console.log('[1/3] 安装依赖...');
    execSync('npm install', { cwd: projectDir, stdio: 'inherit' });
  } else {
    console.log('[1/3] 依赖已安装，跳过');
  }

  // 2. Compile
  console.log('[2/3] 编译 TypeScript...');
  execSync('npm run compile', { cwd: projectDir, stdio: 'inherit' });

  // 3. Configure opencode
  console.log('[3/3] 配置 opencode...');
  fs.mkdirSync(configDir, { recursive: true });
  let config = {};
  if (fs.existsSync(configPath)) {
    try {
      config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    } catch {
      config = {};
    }
  }
  if (!config.mcp) config.mcp = {};
  if (!config.mcp['vue-to-js']) {
    config.mcp['vue-to-js'] = {
      type: 'local',
      command: ['node', entryPoint.replace(/\\/g, '/')],
    };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
    console.log('  已添加到 ' + configPath);
  } else {
    console.log('  vue-to-js 已存在，跳过');
  }

  console.log('\n✅ 安装完成！');
  console.log('   入口: ' + entryPoint);
}

main();
