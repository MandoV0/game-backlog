FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY API_DOCUMENTATION.md ./dist/docs/API_DOCUMENTATION.md
COPY package*.json ./
RUN npm install --omit=dev

EXPOSE 5000
CMD ["node", "dist/server.js"]