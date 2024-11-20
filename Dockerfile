FROM node:18-alpine AS builder

WORKDIR /app

COPY web.package.json package.json

RUN yarn install

COPY . .

RUN yarn run build

RUN yarn install --production --frozen-lockfile

FROM node:18-alpine AS runner



COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./

EXPOSE 3000

ENV NODE_ENV=production

CMD ["yarn", "start"]
