# NOTE: Why do we specify alpine version here?
#   Because if not, we had situations where it would use the different version
#   locally and on Github CI. This way we ensure exact version is used,
#   and also have control over updating it (instead of update surprising us).
FROM node:20 AS base

# Build the project to generate the .wasp/build output
FROM base AS wasp-builder
WORKDIR /wasp
ADD . .
RUN curl -sSL https://get.wasp.sh/installer.sh | sh
RUN /root/.local/bin/wasp build

# Build the server
FROM base AS server-builder
RUN apt update && apt install --yes build-essential python3 libtool autoconf automake && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=wasp-builder /wasp/.wasp/build/src ./src
COPY --from=wasp-builder /wasp/.wasp/build/package.json .
COPY --from=wasp-builder /wasp/.wasp/build/package-lock.json .
COPY --from=wasp-builder /wasp/.wasp/build/server .wasp/build/server
COPY --from=wasp-builder /wasp/.wasp/build/sdk .wasp/out/sdk
# Install npm packages, resulting in node_modules/.
RUN npm install && cd .wasp/build/server && npm install
COPY --from=wasp-builder /wasp/.wasp/build/db/schema.prisma .wasp/build/db/
RUN cd .wasp/build/server && npx prisma generate --schema='../db/schema.prisma'
# Building the server should come after Prisma generation.
RUN cd .wasp/build/server && npm run bundle

# Run the server component
FROM base AS server-production
RUN apt update && apt install --yes python3 && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV production
WORKDIR /app
COPY --from=server-builder /app/node_modules ./node_modules
COPY --from=server-builder /app/.wasp/out/sdk .wasp/out/sdk
COPY --from=server-builder /app/.wasp/build/server/node_modules .wasp/build/server/node_modules
COPY --from=server-builder /app/.wasp/build/server/bundle .wasp/build/server/bundle
COPY --from=server-builder /app/.wasp/build/server/package*.json .wasp/build/server/
# Copy scripts directory only if it exists
RUN --mount=from=server-builder,source=/app/.wasp/build/server,target=/tmp/server \
    if [ -d /tmp/server/scripts ]; then \
        mkdir -p .wasp/build/server/scripts && \
        cp -r /tmp/server/scripts/* .wasp/build/server/scripts/; \
    fi
COPY --from=wasp-builder /wasp/.wasp/build/db/ .wasp/build/db/
EXPOSE ${PORT}
WORKDIR /app/.wasp/build/server
ENTRYPOINT ["npm", "run", "start-production"]

# Any user-defined Dockerfile contents will be appended below.

