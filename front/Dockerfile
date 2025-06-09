FROM node:20.17.0

ENV TZ Asia/Tokyo

WORKDIR /app

# pnpmのインストール
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml /app/
RUN pnpm install --frozen-lockfile

COPY . /app

CMD ["pnpm", "dev", "-p", "3000"]
