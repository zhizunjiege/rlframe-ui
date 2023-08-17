import { ServiceInfo, createGrpcClient, createRestClient } from "~/api";
import { isEmpty } from "~/utils";

export const useAppStore = defineStore("app", {
  state: () => ({
    systemSettings: {
      bffAddr: "localhost:9999", // address of bff server
      webAddr: window.location.host, // address of web server
      maxTerminalMessages: 100, // max number of terminal messages
      detailsRefreshInterval: 1000, // interval of refreshing details
    },
    grpc: null as Nullable<ReturnType<typeof createGrpcClient>>, // grpc client
    rest: null as Nullable<ReturnType<typeof createRestClient>>, // rest client
    registeredServices: [] as ServiceInfo[], // registered services
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

    async setGrpcClient(addr: string) {
      this.systemSettings.bffAddr = addr;
      this.grpc = createGrpcClient(addr);
      const { response } = await this.grpc.getServiceInfo({ ids: [] });
      if (!isEmpty(response.services)) {
        this.registeredServices = Object.values(response.services);
      }
    },
    async setRestClient(addr: string) {
      this.systemSettings.webAddr = addr;
      this.rest = createRestClient(addr);
      await this.rest.select("task", [], { id: -1 });
    },

    async addService(index: number) {
      const service = this.registeredServices[index];
      await this.grpc!.registerService({
        services: { [service.name]: service },
      });
    },
    async delService(index: number) {
      const service = this.registeredServices[index];
      await this.grpc!.unRegisterService({
        ids: [service.name],
      });
    },
  },
});
