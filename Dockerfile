# Dockerfile corrigé
FROM node:20-alpine AS base

# Utilise yarn classique au lieu de corepack (plus stable)
RUN npm install -g yarn@1.22.22

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

COPY . .
RUN yarn build

# Étape de production
FROM node:20-alpine
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/.env ./

EXPOSE 3001
CMD ["yarn", "start"]
