FROM node:13
WORKDIR /app
RUN npm install -g @vue/cli
RUN npm install -g cordova ionic
RUN npm install --global http-server