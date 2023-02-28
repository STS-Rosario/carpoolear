FROM node:16
WORKDIR /app
CMD yarn install && yarn dev
