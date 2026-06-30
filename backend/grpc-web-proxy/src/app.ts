'use strict';

import express from 'express';
import cors from 'cors';
import { handleGrpcWeb } from './proxy';

const app = express();

// Reflect the actual request Origin instead of '*'.
// Using '*' with credentials:true is invalid per the CORS spec —
// browsers reject 'Access-Control-Allow-Origin: *' when cookies/auth
// headers are involved. Reflecting the origin allows any caller while
// still being compatible with credentialed requests.
const corsOptions: cors.CorsOptions = {
  origin:         true,          // reflect the request Origin header
  exposedHeaders: ['grpc-status', 'grpc-message', 'content-type'],
  methods:        ['POST', 'OPTIONS'],
  credentials:    true,
};

app.use(cors(corsOptions));

app.use(express.raw({ type: () => true, limit: '10mb' }));

app.use((req, _res, next) => {
  if (req.method !== 'POST') console.log(`[grpc-web-proxy] ${req.method} ${req.path}`);
  next();
});

app.get('/health', (_req, res) =>
  res.json({ status: 'ok', service: 'grpc-web-proxy', timestamp: new Date().toISOString() })
);

app.use((req, res, next) => {
  if (req.method === 'POST') return handleGrpcWeb(req, res);
  next();
});

export default app;
