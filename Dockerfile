# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install only production deps
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Copy source
COPY . .

# Env + expose
ENV PORT=3000
# Optional: app version for /version endpoint; Jenkins can set this
ENV APP_VERSION=1.0.0

EXPOSE 3000

CMD ["npm", "start"]
