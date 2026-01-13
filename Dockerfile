# Étape 1 : Utilise une image Node avec Yarn préinstallé
FROM node:20-alpine AS base

# Active Yarn avec corepack (méthode moderne recommandée par Node.js)
RUN corepack enable && corepack prepare yarn@stable --activate

# Étape 2 : Installe les dépendances système nécessaires
RUN apk add --no-cache libc6-compat

# Étape 3 : Installe les dépendances du projet
FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock* ./

# Installe les dépendances avec Yarn
RUN yarn --frozen-lockfile

# Étape 4 : Build le projet
FROM base AS builder
WORKDIR /app

# Copie les dépendances installées
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Définit les variables d'environnement
ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=$NEXT_PUBLIC_MEDUSA_BACKEND_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

# Désactive la collecte de données pendant le build
ENV NEXT_TELEMETRY_DISABLED=1

# Build le projet Next.js
RUN yarn build

# Étape 5 : Crée une image légère pour le runtime
FROM base AS runner
WORKDIR /app

# Définit l'environnement de production
ENV NODE_ENV=production

# Crée un utilisateur non-root pour exécuter l'application
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copie les fichiers nécessaires pour le runtime
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Définit l'utilisateur non-root
USER nextjs

# Expose le port 3000 (standard pour Next.js)
EXPOSE 3000

# Définit le port et l'hôte
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Commande de démarrage avec Yarn
CMD ["yarn", "start"]
