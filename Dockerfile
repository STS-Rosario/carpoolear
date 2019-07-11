ARG NODE_VERSION=8.9-alpine
FROM node:${NODE_VERSION}

ENV node_env=development

RUN apk upgrade --update && apk add --update git

WORKDIR /app

COPY package.json package-lock.json  ./

RUN npm install

COPY . .

EXPOSE 8080
CMD [ "npm", "run", "dev" ]
