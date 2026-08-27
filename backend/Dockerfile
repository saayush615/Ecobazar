FROM node:22-slim
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN mkdir -p uploads && chown -R node:node /app/uploads
ENV NODE_ENV=production PORT=3000
EXPOSE 3000

USER node
CMD ["node", "index.js"]