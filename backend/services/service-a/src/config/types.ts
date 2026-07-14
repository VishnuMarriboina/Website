export interface GrpcConfig {
  port: number;
  host: string;
}

export interface DbConfig {
  url: string;
}

export interface JwtConfig {
  secret:           string;
  accessExpiresIn:  string;
  refreshExpiresIn: string;
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
