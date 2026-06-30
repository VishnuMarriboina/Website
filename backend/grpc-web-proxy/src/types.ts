import { GrpcRequest, GrpcResponse, GrpcMetadata } from './grpc-clients/types';
import * as protobuf from 'protobufjs';

export interface ServiceRoute {
  fn:   (r: GrpcRequest, m?: GrpcMetadata) => Promise<GrpcResponse>;
  req:  string;
  res:  string;
}

export interface ServiceEntry extends Record<string, ServiceRoute | protobuf.Root> {
  _root: protobuf.Root;
}

export type ServiceMap = Record<string, ServiceEntry>;
