# --- Base stage: shared Node setup ---
FROM node:12 AS base
WORKDIR /app

# --- Dev stage: for local development with bind mount ---
FROM base AS dev
RUN npm install -g @vue/cli cordova ionic
COPY package*.json ./
RUN npm install
CMD ["npm", "run", "dev"]

# --- Build stage: install deps and build for production ---
FROM base AS build
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_ENV=production
RUN npx cross-env PLATFORM=DESKTOP TARGET_APP=default SERVE=false CORDOVA=false node build/build.js

# --- Prod stage: lightweight nginx serving static files ---
FROM nginx:alpine AS prod
COPY --from=build /app/dist/default/production/www /usr/share/nginx/html
EXPOSE 80
