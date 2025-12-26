FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies
# We need python/make/g++ for some native modules (like webtorrent dependencies might need)
RUN apk add --no-cache python3 make g++

RUN npm install

COPY . .

# Create uploads directory if it doesn't exist
RUN mkdir -p uploads

EXPOSE 5001

CMD ["node", "index.js"]
