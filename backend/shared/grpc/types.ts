export interface GrpcServerOptions {
  protoFile:   string;
  packageName: string;
  serviceName: string;
  handlers:    Record<string, unknown>;
  host?:       string;
  port:        number;
}

export interface GrpcClientOptions {
  protoFile:   string;
  packageName: string;
  serviceName: string;
  host:        string;
  port:        number;
}
