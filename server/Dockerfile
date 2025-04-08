FROM node:22

WORKDIR /app
COPY package*.json ./
RUN npm install --ci
COPY server.js .
EXPOSE 8080
CMD ["npm", "start"]
