FROM node:20-alpine

WORKDIR /app

# Copy proto files (proxy needs them for serialization)
COPY proto/ ./proto/

# Copy proxy source
COPY grpc-web-proxy/package*.json ./grpc-web-proxy/
RUN cd grpc-web-proxy && npm ci --omit=dev

COPY grpc-web-proxy/ ./grpc-web-proxy/

WORKDIR /app/grpc-web-proxy

EXPOSE 8080

CMD ["node", "src/server.js"]
