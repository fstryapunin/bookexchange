FROM node:16-alpine3.14
WORKDIR /server
COPY package*.json ./
COPY .env ./ 
RUN npm install
COPY . .
EXPOSE 3001
CMD [ "node", "server.js" ]