# ==============================================================================
# Wahide Next.js 16 Enterprise Production Multi-Stage Dockerfile
# Base: Bun Builder + Node.js 24 Alpine Minimal Standalone Runner (<120MB)
# ==============================================================================

# ─── Stage 1: Dependency Resolver ───
FROM oven/bun:1-alpine AS deps
WORKDIR /app

# Copy package descriptors
COPY package.json bun.lock ./

# Install dependencies using Bun with frozen lockfile
RUN bun install --frozen-lockfile

# ─── Stage 2: Next.js Production Builder ───
FROM oven/bun:1-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time environment arguments
ARG NEXT_PUBLIC_APP_NAME
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_IAM_API_URL
ARG NEXT_PUBLIC_WHATSAPP_API_URL
ARG NEXT_PUBLIC_CAMPAIGN_API_URL
ARG NEXT_PUBLIC_FINANCE_API_URL
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY

ENV NEXT_PUBLIC_APP_NAME=${NEXT_PUBLIC_APP_NAME}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_PUBLIC_IAM_API_URL=${NEXT_PUBLIC_IAM_API_URL}
ENV NEXT_PUBLIC_WHATSAPP_API_URL=${NEXT_PUBLIC_WHATSAPP_API_URL}
ENV NEXT_PUBLIC_CAMPAIGN_API_URL=${NEXT_PUBLIC_CAMPAIGN_API_URL}
ENV NEXT_PUBLIC_FINANCE_API_URL=${NEXT_PUBLIC_FINANCE_API_URL}
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=${NEXT_PUBLIC_TURNSTILE_SITE_KEY}

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Compile Next.js 16 standalone artifacts
RUN bun run build

# ─── Stage 3: Minimal Production Runner (Node.js 24 Alpine) ───
FROM node:24-alpine AS runner
WORKDIR /app

# Install tini for PID 1 signal forwarding & wget for health probes
RUN apk add --no-cache tini wget

# Security: Create dedicated unprivileged non-root user & group
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Configure permissions for runtime cache
RUN mkdir .next && chown nextjs:nodejs .next

# Copy minimal standalone server artifacts and assets with non-root ownership
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Runtime server environment
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

# Enterprise Container Health Check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ || exit 1

# PID 1 init process forwards SIGTERM & SIGINT gracefully
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]
