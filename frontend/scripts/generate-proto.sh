#!/usr/bin/env bash
# Regenerates the protobufjs JSON descriptors consumed by
# src/grpc/clients/serviceAClient.ts and serviceBClient.ts, straight from the
# canonical .proto files in backend/proto. This replaces hand-maintained
# descriptor files that could silently drift from the backend contract.
set -e

cd "$(dirname "$0")/.."

# Relative, not absolute — buf/pbjs are invoked via npx from the frontend
# directory, and a relative path here works everywhere a resolved absolute
# path may not (e.g. WSL-mounted paths passed to a Windows-native binary).
PROTO_DIR="../backend/proto"
OUT_DIR="src/grpc/proto"

echo "Linting $PROTO_DIR with buf..."
npx buf lint "$PROTO_DIR"

generate() {
  local proto_file="$1"
  local const_name="$2"
  local out_file="$3"

  echo "Generating $out_file from $proto_file..."
  local json
  json="$(npx pbjs -t json -p "$PROTO_DIR" "$PROTO_DIR/$proto_file")"

  {
    echo "// GENERATED FILE — do not edit by hand."
    echo "// Regenerate with: npm run proto:generate (from frontend/)"
    echo "// Source: backend/proto/$proto_file"
    echo
    echo 'import type { ProtobufDescriptor } from "./types";'
    echo
    echo "export const $const_name: ProtobufDescriptor = $json;"
  } > "$OUT_DIR/$out_file"
}

generate "service-a.proto" "SERVICE_A_DESCRIPTOR" "serviceA.ts"
generate "service-b.proto" "SERVICE_B_DESCRIPTOR" "serviceB.ts"

echo "Done."
