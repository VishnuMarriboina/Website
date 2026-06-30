export interface GrpcConfig {
  port: number;
  host: string;
}

export interface DbConfig {
  uri: string;
}

export interface ServiceEndpoint {
  host: string;
  port: number;
}

export interface JwtConfig {
  secret: string;
}

export interface ServiceBConfig {
  env:      string;
  grpc:     GrpcConfig;
  db:       DbConfig;
  jwt:      JwtConfig;
  services: { serviceA: ServiceEndpoint };
}
