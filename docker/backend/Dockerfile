FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend/ ./
RUN mkdir -p uploads

EXPOSE 3000
CMD ["node", "server.js"]
