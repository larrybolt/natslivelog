FROM node:7.7-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install --production

# Bundle app source
COPY . /usr/src/app
COPY ./config.docker.js /usr/src/app/config.js

EXPOSE 3000 3000
CMD [ "npm", "start" ]
