export interface GrpcRequest {
  [key: string]: unknown;
}

export interface GrpcResponse {
  [key: string]: unknown;
}

export interface ServiceAClientMethods {
  healthCheck: ()              => Promise<GrpcResponse>;
  getAll:      (req: GrpcRequest) => Promise<GrpcResponse>;
  getById:     (req: GrpcRequest) => Promise<GrpcResponse>;
  create:      (req: GrpcRequest) => Promise<GrpcResponse>;
  update:      (req: GrpcRequest) => Promise<GrpcResponse>;
  deleteItem:  (req: GrpcRequest) => Promise<GrpcResponse>;
}
