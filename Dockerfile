FROM node:11-alpine

COPY ./package.json /package.json
RUN npm install --no-progress
COPY ./server /server

ENTRYPOINT ["npm", "start"]
