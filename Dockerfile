# --- Base stage: shared Node setup ---
FROM node:20 AS base
WORKDIR /app

# --- Dev stage: for local development with bind mount ---
FROM base AS dev
COPY package*.json ./
RUN npm install --legacy-peer-deps --ignore-scripts
CMD ["npm", "run", "dev"]

# --- Build stage: install deps and build for production ---
FROM base AS build
COPY package*.json ./
RUN npm install --legacy-peer-deps --ignore-scripts
COPY . .
RUN npx cross-env PLATFORM=DESKTOP vite build

# --- Prod stage: lightweight nginx serving static files ---
FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
