# 设置基础镜像
FROM ubuntu:jammy-20240627.1 AS base

# 构建参数
ARG ARG_UID=1000
ARG ARG_GID=1000

# 针对 arm64 架构的构建阶段
FROM base AS build-arm64
RUN echo "为 arm64 架构准备 depression-rag 镜像的构建"

# 使用 bash shell 并开启管道失败即失败的选项
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# 安装系统依赖
# hadolint 忽略规则：DL3008, DL3013
RUN DEBIAN_FRONTEND=noninteractive apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -yq --no-install-recommends \
        unzip curl gnupg libgfortran5 libgbm1 tzdata netcat \
        libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 \
        libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libx11-6 libx11-xcb1 libxcb1 \
        libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 \
        libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release \
        xdg-utils git build-essential ffmpeg && \
    mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
    apt-get update && \
    # 安装 Node.js 和 Yarn
    apt-get install -yq --no-install-recommends nodejs && \
    curl -LO https://github.com/yarnpkg/yarn/releases/download/v1.22.19/yarn_1.22.19_all.deb \
        && dpkg -i yarn_1.22.19_all.deb \
        && rm yarn_1.22.19_all.deb && \
    # 安装 uvx（锁定版本 0.6.10）以支持 MCP
    curl -LsSf https://astral.sh/uv/0.6.10/install.sh | sh && \
        mv /root/.local/bin/uv /usr/local/bin/uv && \
        mv /root/.local/bin/uvx /usr/local/bin/uvx && \
        echo "已安装 uvx! $(uv --version)" && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 创建具有指定 UID 和 GID 的用户和用户组
RUN groupadd -g "$ARG_GID" depression-rag && \
    useradd -l -u "$ARG_UID" -m -d /app -s /bin/bash -g depression-rag depression-rag && \
    mkdir -p /app/frontend/ /app/server/ /app/collector/ && chown -R depression-rag:depression-rag /app

# 复制 Docker 辅助脚本
COPY ./docker/docker-entrypoint.sh /usr/local/bin/
COPY ./docker/docker-healthcheck.sh /usr/local/bin/
COPY --chown=depression-rag:depression-rag ./docker/.env.example /app/server/.env

# 确保脚本可执行
RUN chmod +x /usr/local/bin/docker-entrypoint.sh && \
    chmod +x /usr/local/bin/docker-healthcheck.sh

USER depression-rag
WORKDIR /app

# Puppeteer 不支持 ARM86 架构的 Chromium 构建，需要手动安装兼容版本
RUN echo "为 ARM86 修补 Puppeteer 与 Chromium 支持 - 正在安装依赖!" && \
    curl https://playwright.azureedge.net/builds/chromium/1088/chromium-linux-arm64.zip -o chrome-linux.zip && \
    unzip chrome-linux.zip && \
    rm -rf chrome-linux.zip

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV CHROME_PATH=/app/chrome-linux/chrome
ENV PUPPETEER_EXECUTABLE_PATH=/app/chrome-linux/chrome

RUN echo "完成 arm64 架构专属安装步骤"

#############################################

# 针对 amd64 架构的构建阶段
FROM base AS build-amd64
RUN echo "为非 ARM 架构准备 depression-rag 镜像的构建"

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# 安装系统依赖（同 arm64）
RUN DEBIAN_FRONTEND=noninteractive apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -yq --no-install-recommends \
        curl gnupg libgfortran5 libgbm1 tzdata netcat \
        libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 \
        libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libx11-6 libx11-xcb1 libxcb1 \
        libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 \
        libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release \
        xdg-utils git build-essential ffmpeg && \
    mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
    apt-get update && \
    apt-get install -yq --no-install-recommends nodejs && \
    curl -LO https://github.com/yarnpkg/yarn/releases/download/v1.22.19/yarn_1.22.19_all.deb \
        && dpkg -i yarn_1.22.19_all.deb \
        && rm yarn_1.22.19_all.deb && \
    curl -LsSf https://astral.sh/uv/0.6.10/install.sh | sh && \
        mv /root/.local/bin/uv /usr/local/bin/uv && \
        mv /root/.local/bin/uvx /usr/local/bin/uvx && \
        echo "已安装 uvx! $(uv --version)" && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 创建用户
RUN groupadd -g "$ARG_GID" depression-rag && \
    useradd -l -u "$ARG_UID" -m -d /app -s /bin/bash -g depression-rag depression-rag && \
    mkdir -p /app/frontend/ /app/server/ /app/collector/ && chown -R depression-rag:depression-rag /app

# 拷贝脚本与环境文件
COPY ./docker/docker-entrypoint.sh /usr/local/bin/
COPY ./docker/docker-healthcheck.sh /usr/local/bin/
COPY --chown=depression-rag:depression-rag ./docker/.env.example /app/server/.env

# 设置脚本权限
RUN chmod +x /usr/local/bin/docker-entrypoint.sh && \
    chmod +x /usr/local/bin/docker-healthcheck.sh

#############################################
# 所有架构通用的构建流程
#############################################

# hadolint 忽略规则：DL3006
FROM build-${TARGETARCH} AS build
RUN echo "执行适用于所有架构的 depression-rag 镜像通用构建流程"

USER depression-rag
WORKDIR /app

# 安装并构建前端层
FROM build AS frontend-build
COPY --chown=depression-rag:depression-rag ./frontend /app/frontend/
WORKDIR /app/frontend
RUN yarn install --network-timeout 100000 && yarn cache clean
RUN yarn build && \
    cp -r dist /tmp/frontend-build && \
    rm -rf * && \
    cp -r /tmp/frontend-build dist && \
    rm -rf /tmp/frontend-build
WORKDIR /app

# 安装后端（服务器）代码及依赖
FROM build AS backend-build
COPY --chown=depression-rag:depression-rag ./server /app/server/
WORKDIR /app/server
RUN yarn install --production --network-timeout 100000 && yarn cache clean
WORKDIR /app

# 安装 collector 相关依赖
COPY --chown=depression-rag:depression-rag ./collector/ ./collector/
WORKDIR /app/collector
ENV PUPPETEER_DOWNLOAD_BASE_URL=https://storage.googleapis.com/chrome-for-testing-public
RUN yarn install --production --network-timeout 100000 && yarn cache clean

WORKDIR /app
USER depression-rag

# 构建最终生产镜像，将前端静态文件复制到后端
FROM backend-build AS production-build
WORKDIR /app
COPY --chown=depression-rag:depression-rag --from=frontend-build /app/frontend/dist /app/server/public
USER root
RUN chown -R depression-rag:depression-rag /app/server && \
    chown -R depression-rag:depression-rag /app/collector
USER depression-rag

# 设置环境变量
ENV NODE_ENV=production
ENV ANYTHING_LLM_RUNTIME=docker

# 配置健康检查
HEALTHCHECK --interval=1m --timeout=10s --start-period=1m \
  CMD /bin/bash /usr/local/bin/docker-healthcheck.sh || exit 1

# 启动服务器
# CMD ["sh", "-c", "tail -f /dev/null"] # 开发模式：保持容器运行
ENTRYPOINT ["/bin/bash", "/usr/local/bin/docker-entrypoint.sh"]
