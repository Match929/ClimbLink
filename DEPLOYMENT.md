# GitHub Pages 部署指南

## 前置条件

1. 确保你已经有一个 GitHub 账号
2. 确保你的微信云开发环境已配置好未登录访问权限

## 部署步骤

### 第一步：初始化 Git 仓库

```bash
git init
git add .
git commit -m "Initial commit"
```

### 第二步：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 创建一个新的仓库（可以是 public 或 private）
3. 不要初始化 README、.gitignore 或 LICENSE

### 第三步：关联远程仓库

```bash
git remote add origin https://github.com/你的用户名/你的仓库名.git
git branch -M main
git push -u origin main
```

### 第四步：配置 GitHub Pages

#### 方案 A：使用 gh-pages 分支（推荐）

1. 安装 gh-pages 工具：
```bash
npm install -D gh-pages
```

2. 在 `package.json` 中添加部署脚本：
```json
{
  "scripts": {
    "deploy": "gh-pages -d dist/build/h5"
  }
}
```

3. 运行部署：
```bash
npm run deploy
```

4. 在 GitHub 仓库设置中：
   - 进入 Settings → Pages
   - Source 选择 `Deploy from a branch`
   - Branch 选择 `gh-pages`
   - 点击 Save

#### 方案 B：使用 GitHub Actions 自动部署

创建 `.github/workflows/deploy.yml` 文件：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build H5
        run: npm run build:h5
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/build/h5
```

然后在仓库设置中：
- 进入 Settings → Pages
- Source 选择 `Deploy from a branch`
- Branch 选择 `gh-pages`
- 点击 Save

## 重要提醒

### 微信云开发配置

确保你已经在微信云开发控制台完成以下配置：

1. **开启未登录访问权限**
   - 进入云开发控制台 → 设置 → 其他设置
   - 开启「未登录用户访问云资源权限」

2. **配置数据库权限**
   - 进入云开发控制台 → 数据库
   - 对每个集合设置权限规则为：
   ```json
   {
     "read": true,
     "write": true
   }
   ```

3. **获取环境 ID**
   - 在云开发控制台 → 设置 → 环境设置
   - 确认环境 ID 与 `src/utils/cloud.js` 中的一致

## 访问你的网站

部署完成后，你的网站将可以通过以下地址访问：
```
https://你的用户名.github.io/你的仓库名/
```

## 注意事项

1. GitHub Pages 使用 HTTPS，微信云开发 API 支持 HTTPS
2. 首次部署可能需要几分钟时间生效
3. 如果是私有仓库，GitHub Pages 仍然可以公开访问（除非使用 GitHub Enterprise）
4. 由于使用了未登录模式，数据库操作不需要用户登录微信
