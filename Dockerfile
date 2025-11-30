# Stage 1: Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=1024"
ENV ESBUILD_WORKERS=1

# Copy package files
COPY package.json ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Stage 2: Production stage
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration (serve FE + proxy /backend)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

