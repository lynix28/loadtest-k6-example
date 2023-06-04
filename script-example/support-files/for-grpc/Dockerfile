FROM node

WORKDIR /app

RUN mkdir /app/server

COPY server/. /app/server

COPY package.json /app

RUN npm install

EXPOSE 50051

CMD ["npm", "start"]