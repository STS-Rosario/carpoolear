FROM node:16
WORKDIR /app
RUN npm install -g @vue/cli
CMD yarn install && yarn dev
