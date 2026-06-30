FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY services/service-a/package*.json ./
RUN npm ci --omit=dev

FROM base AS runner
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY services/service-a/src ./src
COPY proto ../proto
COPY shared ../shared

EXPOSE 50051

USER node
CMD ["node", "src/server.js"]
