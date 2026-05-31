# Multi-stage Dockerfile for the Agelo public website (Astro + Starlight).
#
# Stage 1: install deps and run `astro build` to produce static output in /app/dist.
# Stage 2: serve that output through nginx.
#
# Build context is the repo root.

FROM node:20-alpine AS build
WORKDIR /app

# Copy lockfile + manifest first to maximise layer caching.
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

COPY . .
# Skip `astro check` in the production image — it runs in CI on every PR;
# `astro build` alone produces the static output.
RUN npx astro build

FROM nginx:alpine AS final
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
