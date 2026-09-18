FROM node:20-alpine

WORKDIR /app

# Cai dependency truoc de tan dung cache cua Docker
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source code
COPY server.js ./
COPY public ./public

EXPOSE 8088

CMD ["node", "server.js"]
