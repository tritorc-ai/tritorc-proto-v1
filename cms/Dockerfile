# Tritorc Strapi (cms/) production image. Build context = cms/.
#   docker build -t tritorc-cms ./cms
# Content lives in Postgres and uploads in S3 (see deploy/README.md), never in this image.

FROM node:22-bookworm-slim AS build
WORKDIR /app
# Compilers are only a fallback for native modules that have no prebuilt binary.
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# `strapi build` loads the config, so it needs placeholder secrets. They are not kept in the image:
# the real values arrive as environment variables when the container starts.
ARG PUBLIC_URL=""
ENV NODE_ENV=production \
    PUBLIC_URL=${PUBLIC_URL} \
    APP_KEYS=build,build,build,build \
    API_TOKEN_SALT=build ADMIN_JWT_SECRET=build TRANSFER_TOKEN_SALT=build \
    JWT_SECRET=build ENCRYPTION_KEY=build \
    STRAPI_TELEMETRY_DISABLED=true
RUN npm run build && npm prune --omit=dev

FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=1338 \
    STRAPI_TELEMETRY_DISABLED=true
COPY --from=build --chown=node:node /app /app
# Only used when S3_BUCKET is not set (local testing). Disappears with the container.
RUN mkdir -p /app/public/uploads /app/.tmp && chown -R node:node /app/public /app/.tmp
USER node
EXPOSE 1338
HEALTHCHECK --interval=15s --timeout=5s --start-period=60s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||1338)+'/_health').then(r=>process.exit(r.status<400?0:1)).catch(()=>process.exit(1))"
CMD ["npm", "run", "start"]
