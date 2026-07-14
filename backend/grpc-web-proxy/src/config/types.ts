export interface ServiceEndpoint {
  host: string;
  port: number;
}

export interface RateLimitConfig {
  windowMs: number;
  max:      number;
}

export interface ProxyConfig {
  env:       string;
  port:      number;
  cors:      { origin: string };
  rateLimit: RateLimitConfig;
  services:  {
    serviceA: ServiceEndpoint;
    serviceB: ServiceEndpoint;
  };
}
