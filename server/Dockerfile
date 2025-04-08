FROM node:22-slim

WORKDIR /app
COPY package*.json ./
RUN npm install --ci
COPY server.js .
EXPOSE 8080
CMD ["npm", "start"]
