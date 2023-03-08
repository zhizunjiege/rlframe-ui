import { createGrpcClient, createRestClient } from "api";

export const useAppStore = defineStore("app", {
  state: () => ({
    maxTerminalMsgs: 200, // max number of terminal messages
    localDataExpire: 365, // local storage expire time in days
    bffAddr: "localhost:10000", // address of bff server
    grpcAddr: "", // last used address of grpc server
    grpcClient: null as Nullable<ReturnType<typeof createGrpcClient>>, // grpc client
    webAddr: "localhost:8080", // address of web server
    restAddr: "", // last used address of rest server
    restClient: null as Nullable<ReturnType<typeof createRestClient>>, // rest client
  }),
  getters: {
    grpc: (state) => {
      if (!state.grpcClient || state.bffAddr !== state.grpcAddr) {
        state.grpcAddr = state.bffAddr;
        state.grpcClient = createGrpcClient(state.bffAddr);
      }
      return state.grpcClient;
    },
    rest: (state) => {
      if (!state.restClient || state.webAddr !== state.restAddr) {
        state.restAddr = state.webAddr;
        state.restClient = createRestClient(state.webAddr);
      }
      return state.restClient;
    },
  },
});
