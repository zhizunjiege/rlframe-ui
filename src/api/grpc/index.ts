import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { BFFClient } from "./bff.client";

// export all messages
export * from "./types";
export * from "./agent";
export * from "./simenv";
export * from "./bff";

// export grpc client creator
export function createGrpcClient(addr: string) {
  const transport = new GrpcWebFetchTransport({
    baseUrl: `http://${addr}`,
  });
  const client = new BFFClient(transport);
  return client;
}
