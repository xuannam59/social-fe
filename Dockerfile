# Stage 1: Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Accept build arguments for environment variables
ARG VITE_BACKEND_URL
ARG VITE_AWS_REGION
ARG VITE_S3_BUCKET_KEY
ARG VITE_PORT=3000

# Set environment variables for build
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_AWS_REGION=$VITE_AWS_REGION
ENV VITE_S3_BUCKET_KEY=$VITE_S3_BUCKET_KEY
ENV VITE_PORT=$VITE_PORT

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

# Copy nginx configuration (optional, for SPA routing)
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

