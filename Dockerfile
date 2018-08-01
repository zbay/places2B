FROM node:8
RUN mkdir /places2B
RUN mkdir /places2B/server
RUN mkdir /places2B/public

COPY server/package.json /places2B/server
RUN npm install
COPY /server /places2B/server

COPY /public/package.json /places2B/public
RUN npm install -g @angular/cli@latest
WORKDIR /places2B/public
RUN npm install
COPY . /places2B/public
RUN ls
WORKDIR /places2B/public
RUN ng build --prod

WORKDIR /places2B/server
RUN node server