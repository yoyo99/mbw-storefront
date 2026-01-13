FROM node:20-alpine AS builder

WORKDIR /app

# Utilise corepack (méthode officielle depuis Node 16+)
RUN corepack enable && corepack prepare yarn@stable --activate

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Image finale
FROM node:20-alpine
WORKDIR /app

RUN corepack enable

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env ./

RUN yarn install --production

EXPOSE 3001
CMD ["yarn", "start"]
