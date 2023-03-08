#!/bin/bash

export SRC_DIR=3rd/rlframe-protos/src
export TAR_DIR=src/api/grpc

# generate ts files
npx protoc --proto_path $SRC_DIR --ts_out $TAR_DIR $SRC_DIR/*.proto

# format js/ts files
npx prettier --write $TAR_DIR/**/*.ts
