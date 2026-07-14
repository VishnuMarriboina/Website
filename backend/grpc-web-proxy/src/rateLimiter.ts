'use strict';

// In-memory fixed-window limiter keyed by "clientIp:method". Single-process
// only — fine for this proxy (one instance, no shared cache wired up), but
// won't coordinate across replicas if this is ever scaled horizontally.

interface Bucket {
  count:   number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed:        boolean;
  retryAfterSec:  number;
}

export const checkRateLimit = (key: string, windowMs: number, max: number): RateLimitResult => {
  const now    = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }

  if (bucket.count >= max) {
    return { allowed: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSec: 0 };
};

// Periodic sweep so expired buckets don't accumulate forever.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now >= bucket.resetAt) buckets.delete(key);
  }
}, 60_000).unref();
