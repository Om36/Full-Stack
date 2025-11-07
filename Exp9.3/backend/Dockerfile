FROM node:18-alpine

ENV NODE_ENV=production
WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm ci --only=production

# copy app sources
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
