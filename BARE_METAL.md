以下是该文档的中文翻译：

---

# 在生产环境中运行 AnythingLLM（无需 Docker）

> ⚠️ **警告**  
> 此部署方式**不受核心团队支持**，仅作为您部署的参考。  
> 在此模式下，**您需要完全负责**部署和数据的安全性。  
> **任何问题**，如果是裸机或非容器化部署引起的，**将不会获得解答或支持**。

本文档提供了在不使用 Docker 容器的情况下运行 AnythingLLM 的脚本和已验证流程。

---

### 最低要求

> 💡 **提示**  
> 建议至少配备 2GB RAM。磁盘存储应根据实际存储需求（文档、向量、模型等）配置，建议至少 10GB。

- NodeJS v18  
- Yarn 包管理器  

---

## 开始部署

1. 将仓库克隆到服务器上，使用将运行应用程序的用户账号：  
   ```bash
   git clone git@github.com:Mintplex-Labs/anything-llm.git
   ```

2. 进入项目目录并运行 `yarn setup` 安装所有运行依赖并进行调试：  
   ```bash
   cd anything-llm  
   yarn setup
   ```

3. 复制环境变量模板文件以创建配置文件：  
   ```bash
   cp server/.env.example server/.env
   ```

4. 确保 `server/.env` 至少包含以下键值，用于设置服务启动时所需的存储路径：  
   ```bash
   STORAGE_DIR="/your/absolute/path/to/server/storage"
   ```

5. 编辑 `frontend/.env` 文件，将 `VITE_API_BASE` 设置为 `/api`：  
   ```env
   # VITE_API_BASE='http://localhost:3001/api' # 本地开发时使用  
   # VITE_API_BASE="https://$CODESPACE_NAME-3001.$GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN/api" # GitHub Codespaces  
   VITE_API_BASE='/api' # 用于部署在非 localhost 或 Docker 时
   ```

---

## 启动应用程序

AnythingLLM 由三个主要部分组成：`frontend`（前端）、`server`（服务器）、`collector`（收集器）。在生产环境中，你需要分别运行 `server` 和 `collector` 两个进程，并提前编译前端代码。

1. 编译前端应用：  
   ```bash
   cd frontend && yarn build
   ```

2. 将编译后的前端文件复制到服务器目录中：  
   ```bash
   cp -R frontend/dist server/public
   ```

3. 准备数据库文件并执行迁移操作：  
   ```bash
   cd server && npx prisma generate --schema=./prisma/schema.prisma  
   cd server && npx prisma migrate deploy --schema=./prisma/schema.prisma
   ```

4. 启动服务器进程（生产环境）：  
   ```bash
   cd server && NODE_ENV=production node index.js &
   ```

5. 启动收集器进程（另一个终端或进程中）：  
   ```bash
   cd collector && NODE_ENV=production node index.js &
   ```

AnythingLLM 应该现在已经运行在 `http://localhost:3001`！

---

## 更新 AnythingLLM

要更新 AnythingLLM，可通过以下命令拉取最新代码并重新部署：

```bash
git pull origin master
```

然后重复步骤 2 - 5 以完成更新。

**注意事项：**  
- 确保每个目录重新运行 `yarn` 以更新依赖包。  
- 更新前使用 `pkill node` 杀死旧进程，避免出现多个实例导致冲突。

---

### 示例更新脚本

```bash
#!/bin/bash

cd $HOME/anything-llm &&\
git checkout . &&\
git pull origin master &&\
echo "HEAD pulled to commit $(git log -1 --pretty=format:"%h" | tail -n 1)"

echo "Freezing current ENVs"
curl -I "http://localhost:3001/api/env-dump" | head -n 1 | cut -d$' ' -f2

echo "Rebuilding Frontend"
cd $HOME/anything-llm/frontend && yarn && yarn build && cd $HOME/anything-llm

echo "Copying to Server Public"
rm -rf server/public
cp -r frontend/dist server/public

echo "Killing node processes"
pkill node

echo "Installing collector dependencies"
cd $HOME/anything-llm/collector && yarn

echo "Installing server dependencies & running migrations"
cd $HOME/anything-llm/server && yarn
cd $HOME/anything-llm/server && npx prisma migrate deploy --schema=./prisma/schema.prisma
cd $HOME/anything-llm/server && npx prisma generate

echo "Booting up services."
truncate -s 0 /logs/server.log
truncate -s 0 /logs/collector.log

cd $HOME/anything-llm/server
(NODE_ENV=production node index.js) &> /logs/server.log &

cd $HOME/anything-llm/collector
(NODE_ENV=production node index.js) &> /logs/collector.log &
```

---