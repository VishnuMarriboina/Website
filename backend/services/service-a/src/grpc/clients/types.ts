export interface GrpcRequest {
  [key: string]: unknown;
}

export interface GrpcResponse {
  [key: string]: unknown;
}

export interface ServiceBClientMethods {
  getById:      (req: GrpcRequest) => Promise<GrpcResponse>;
  getAll:       (req: GrpcRequest) => Promise<GrpcResponse>;
  create:       (req: GrpcRequest) => Promise<GrpcResponse>;
  update:       (req: GrpcRequest) => Promise<GrpcResponse>;
  deleteRecord: (req: GrpcRequest) => Promise<GrpcResponse>;
}
