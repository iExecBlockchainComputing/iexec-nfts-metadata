FROM node:11-alpine

COPY ./package.json /package.json
COPY ./server       /server

RUN npm install

ENTRYPOINT ["npm", "start"]
