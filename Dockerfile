# --- Base stage: shared Node setup ---
FROM node:18-slim AS base
WORKDIR /app

# --- Dev stage: for local development with bind mount ---
FROM base AS dev
COPY package*.json ./
RUN npm install
CMD ["npm", "run", "dev"]

# --- Build stage: install deps and build for production ---
FROM base AS build
COPY package*.json ./
RUN npm ci
COPY . .
ENV NODE_ENV=production
RUN npx vite build

# --- Prod stage: lightweight nginx serving static files ---
FROM nginx:alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/default/production/www /usr/share/nginx/html
EXPOSE 80
