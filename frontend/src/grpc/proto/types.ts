/** TypeScript shape for a protobufjs JSON descriptor object. */

export interface ProtobufFieldDef {
  type: string;
  id: number;
  rule?: string;
}

export interface ProtobufMethodDef {
  requestType: string;
  responseType: string;
}

export interface ProtobufServiceDef {
  methods: Record<string, ProtobufMethodDef>;
}

export interface ProtobufMessageDef {
  fields: Record<string, ProtobufFieldDef>;
}

export interface ProtobufNamespaceDef {
  nested: Record<string, ProtobufMessageDef | ProtobufServiceDef>;
}

export interface ProtobufDescriptor {
  nested: Record<string, ProtobufNamespaceDef>;
}
