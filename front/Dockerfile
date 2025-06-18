# 1. Base Stage: 基本設定
FROM node:20.17.0-alpine AS base

ENV TZ Asia/Tokyo

WORKDIR /app

RUN npm install -g pnpm
# 2. Dependencies Stage: 依存関係のインストール
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
# --prod=false: 開発依存もインストールすることを明示します（開発環境用）。
RUN pnpm install --frozen-lockfile --prod=false

# 3. Builder Stage: アプリケーションコードのコピーとNext.jsのビルド
FROM base AS builder
WORKDIR /app

# Dependencies Stageからnode_modulesをコピー
COPY --from=deps /app/node_modules ./node_modules

# ここでの変更は、depsステージのキャッシュには影響しない
COPY . .

# Next.jsアプリケーションのビルド (本番デプロイ時など、ビルドが必要な場合)
# RUN pnpm build

# 4. Runner Stage: 最終的な実行環境
#    開発サーバーを起動するための軽量なイメージです。
FROM base AS runner
WORKDIR /app

# Builder Stageから必要な成果物をコピー
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json


CMD ["pnpm", "dev", "-p", "3000"]
