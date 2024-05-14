FROM node:latest
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY Main.js ./
COPY public ./public
COPY routes ./routes
COPY views ./views
EXPOSE 3000
CMD ["node", "Main.js"]