import { createGrpcClient, createRestClient } from "api";

export const useAppStore = defineStore("app", {
  state: () => ({
    systemSettings: {
      bffAddr: "localhost:9999", // address of bff server
      webAddr: window.location.host, // address of web server
      maxTerminalMsgs: 100, // max number of terminal messages
    },
    grpc: null as Nullable<ReturnType<typeof createGrpcClient>>, // grpc client
    rest: null as Nullable<ReturnType<typeof createRestClient>>, // rest client
  }),
  actions: {
    loadSystemSettings() {
      const jsonStr = localStorage.getItem("systemSettings");
      if (jsonStr) {
        this.systemSettings = JSON.parse(jsonStr);
      }
    },
    saveSystemSettings() {
      localStorage.setItem(
        "systemSettings",
        JSON.stringify(this.systemSettings)
      );
    },

    setGrpcClient() {
      this.grpc = createGrpcClient(this.systemSettings.bffAddr);
    },
    setRestClient() {
      this.rest = createRestClient(this.systemSettings.webAddr);
    },
  },
});
