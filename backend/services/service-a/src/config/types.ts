export interface GrpcConfig {
  port: number;
  host: string;
}

export interface DbConfig {
  uri: string;
}

export interface JwtConfig {
  secret:    string;
  expiresIn: string;
}

export interface ServiceEndpoint {
  host: string;
  port: number;
}

export interface ServiceAConfig {
  env:      string;
  grpc:     GrpcConfig;
  db:       DbConfig;
  jwt:      JwtConfig;
  services: { serviceB: ServiceEndpoint };
}
