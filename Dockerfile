# specify the node base image with your desired version node:<version>
FROM node:alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY index.mjs ./

CMD ["node", "index.mjs"]
