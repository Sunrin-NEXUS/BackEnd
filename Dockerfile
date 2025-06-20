FROM node:22.14.0-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm run build

# 실제 실행용 이미지 (경량)
FROM node:22.14.0-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY views/ /app/views/

# 프로덕션 실행
CMD ["node", "dist/main"]
