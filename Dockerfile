FROM node:13
WORKDIR /app
RUN npm install -g @vue/cli
CMD npm install && npm run dev