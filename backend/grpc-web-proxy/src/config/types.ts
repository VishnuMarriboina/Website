export interface ServiceEndpoint {
  host: string;
  port: number;
}

export interface ProxyConfig {
  env:      string;
  port:     number;
  cors:     { origin: string };
  services: {
    serviceA: ServiceEndpoint;
    serviceB: ServiceEndpoint;
  };
}
