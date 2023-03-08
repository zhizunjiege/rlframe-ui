@echo off

set SRC_DIR=3rd/rlframe-protos/src
set TAR_DIR=src/api/grpc

@REM generate ts files
call npx protoc --proto_path %SRC_DIR% --ts_out %TAR_DIR% %SRC_DIR%/*.proto

@REM format ts files
call npx prettier --write %TAR_DIR%/**/*.ts
