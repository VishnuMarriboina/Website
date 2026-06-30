#!/usr/bin/env bash
# Generate gRPC stubs from proto files (if you add a codegen step later)
# Currently @grpc/proto-loader loads protos at runtime — no codegen needed.
# This script is a placeholder for when you add grpc-tools codegen.

set -e

PROTO_DIR="$(cd "$(dirname "$0")/.." && pwd)/proto"
OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/generated"

mkdir -p "$OUT_DIR"

echo "Proto directory: $PROTO_DIR"
echo "Output directory: $OUT_DIR"

# Example grpc_tools_node_protoc usage (uncomment when grpc-tools is installed):
# for f in "$PROTO_DIR"/*.proto; do
#   grpc_tools_node_protoc \
#     --js_out=import_style=commonjs,binary:"$OUT_DIR" \
#     --grpc_out=grpc_js:"$OUT_DIR" \
#     --proto_path="$PROTO_DIR" \
#     "$f"
#   echo "Generated: $(basename $f)"
# done

echo "Proto files use runtime loading via @grpc/proto-loader — no codegen needed."
echo "Add grpc-tools to package.json if static codegen is required."
